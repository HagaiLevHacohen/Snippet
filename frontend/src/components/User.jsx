import avatar from "../assets/avatars/avatar.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRequest, deleteFollow } from "../api/follow";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

function User({ item }) {
  const { user: authUser }= useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ({ action, receiverId }) => {
      if (action === "follow") return createRequest(receiverId);
      if (action === "unfollow") return deleteFollow(receiverId);
      throw new Error("Invalid action");
    },

    onMutate: async ({ action, receiverId }) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousData = queryClient.getQueriesData({ queryKey: ["users"] });

      queryClient.setQueriesData({ queryKey: ["users"] }, (oldData) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((user) => {
              if (user.id !== receiverId) return user;

              return {
                ...user,
                followStatus:
                  action === "follow" ? "REQUESTED" : "NONE",
              };
            }),
          })),
        };
      });

      return { previousData };
    },

    onError: (err, variables, context) => {
      context?.previousData?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      toast.error("Error processing request");
    },

    onSuccess: (_, { action }) => {
      toast.success(
        action === "follow"
          ? "Follow request sent"
          : "Unfollowed successfully"
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleFollowClick = (e) => {
    e.stopPropagation();

    const action =
      item.followStatus === "FOLLOWING" ? "unfollow" : "follow";

    mutation.mutate({ action, receiverId: item.id });
  };

  const handleNavigate = () => {
    navigate(`/profile/${item.username}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-750 hover:shadow-lg hover:shadow-violet-500/10 transition cursor-pointer"
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        <img
          src={item.avatarUrl ?? avatar}
          alt={item.username}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
        />

        <div className="flex flex-col">
          <span className="text-white font-semibold">{item.name}</span>
          <span className="text-gray-400 text-sm">@{item.username}</span>
        </div>
      </div>

      {/* Follow button */}
      { authUser.id !== item.id && 
      <button
        onClick={handleFollowClick}
        disabled={item.followStatus === "REQUESTED" || mutation.isPending}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm

          ${
            item.followStatus === "FOLLOWING"
              ? "bg-linear-to-r from-gray-600 to-gray-500 text-white hover:from-red-500 hover:to-red-600 hover:shadow-red-500/30"
              : item.followStatus === "REQUESTED"
              ? "bg-linear-to-r from-yellow-500 to-yellow-400 text-white cursor-not-allowed opacity-80"
              : "bg-linear-to-r from-violet-500 to-purple-500 text-white hover:from-violet-400 hover:to-purple-400 hover:shadow-violet-500/30"
          }
        `}
      >
        {item.followStatus === "FOLLOWING"
          ? "Following"
          : item.followStatus === "REQUESTED"
          ? "Requested"
          : "Follow"}
      </button>
      }
    </div>
  );
}

export default User;