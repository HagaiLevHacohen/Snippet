import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptRequest, rejectRequest } from "../api/follow";
import avatar from "../assets/avatars/avatar.png";
import toast from "react-hot-toast";

function Request({ sender, page }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const statusColors = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    ACCEPTED: "bg-green-500/20 text-green-400 border-green-500/30",
    REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
  };


  const mutation = useMutation({
    mutationFn: ({ action, userId }) => {
      if (action === "accept") {
        return acceptRequest(userId);
      }
      if (action === "reject") {
        return rejectRequest(userId);
      }
    },

    onSuccess: (_, variables) => {
      const { action } = variables;

      toast.success(
        action === "accept"
          ? "Follow request accepted!"
          : "Follow request rejected!"
      );

      queryClient.invalidateQueries({ queryKey: ["followRequests"] });
      queryClient.invalidateQueries({ queryKey: ["followers", user?.id] });
    },

    onError: (err) => {
      if (err?.errors) {
        const apiErrors = {};
        err.errors.forEach((e) => {
          apiErrors[e.path] = e.msg;
        });
        setErrors(apiErrors);
      } else {
        toast.error(err.message || "Action failed. Try again.");
      }
    },
  });

   const handleAction = ({ action, userId }) => {
     mutation.mutate({ action, userId });
   };

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-750 transition-colors">
      
      {/* LEFT: Avatar + Info */}
      <div className="flex items-center gap-3">
        <img
          src={sender.avatarUrl ?? avatar}
          alt={sender.username}
          className="w-11 h-11 rounded-full object-cover border border-gray-700"
        />

        <div className="flex flex-col">
          <span className="font-semibold text-white">
            {sender.name}
          </span>
          <span className="text-sm text-gray-400">
            @{sender.username}
          </span>
        </div>
      </div>

      {/* RIGHT: Status / Actions */}
      <div className="flex items-center gap-2">
        
        {/* STATUS BADGE */}
        <span
          className={`text-xs px-2 py-1 rounded-full border ${statusColors[sender.status]}`}
        >
          {sender.status}
        </span>

        {/* ACTIONS */}
        {page === "pending" && (
          <>
            <button
              onClick={() => handleAction({ action: "accept", userId: sender.id })}
              disabled={mutation.isPending}
              className="px-3 py-1 text-sm rounded-md bg-green-600 hover:bg-green-500 transition disabled:opacity-50"
            >
              Accept
            </button>
            <button
              onClick={() => handleAction({ action: "reject", userId: sender.id })}
              disabled={mutation.isPending}
              className="px-3 py-1 text-sm rounded-md bg-red-600 hover:bg-red-500 transition disabled:opacity-50"
            >
              Reject
            </button>
          </>
        )}

        {page === "accepted" && (
          <button
            className="px-3 py-1 text-sm rounded-md bg-gray-700 text-gray-300 cursor-default"
          >
            Follower
          </button>
        )}

        {page === "rejected" && (
          <button
            className="px-3 py-1 text-sm rounded-md bg-gray-800 text-gray-500 cursor-not-allowed"
          >
            Rejected
          </button>
        )}
      </div>
    </div>
  );
}

export default Request;