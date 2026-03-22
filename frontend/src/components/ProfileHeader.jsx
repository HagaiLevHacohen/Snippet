import { useState } from 'react'
import { useAuth } from "./context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import avatar from "../assets/avatars/avatar.png";
import { createRequest } from '../api/follow';
import toast from "react-hot-toast";

function ProfileHeader({ user }) {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();
  const isOwnProfile = user?.username === authUser?.username;

  const mutation = useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      // invalidate the user query here to refetch the updated data
      toast.success("Follow request sent");
      queryClient.invalidateQueries(["user", user.username]);
    },
    onError: (err) => {
      toast.error("Error sending follow request");
    },
  });

  const handleFollowClick = () => {
    mutation.mutate({ recieverId: user.id });
  };


  return (
    <div className='flex flex-col w-7/10 min-w-75 bg-gray-800 rounded-lg p-4 gap-8'>

      <div className='flex w-full items-center justify-between'>
        <div className="flex items-center gap-4">
            {/* Avatar */}
            <img
                className="w-16 h-16 rounded-full object-cover"
                src={user.avatarUrl ?? avatar}
                alt={user.username}
            />

            {/* Name + username stacked */}
            <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                <h2 className="text-sm md:text-lg text-gray-400">@ {user.username}</h2>
            </div>
        </div>
        {isOwnProfile ? 
        <button className='h-10 bg-violet-500 hover:bg-violet-600 text-white px-3 py-1 rounded-lg'>Edit Profile</button>
        :
        <button onClick={handleFollowClick} className={`h-10 ${user.followStatus === "FOLLOWING" ? 'bg-gray-500 hover:bg-red-600' : 'bg-violet-500 hover:bg-violet-600'} text-white px-3 py-1 rounded-lg`}>   {user.followStatus === "FOLLOWING" ? "Following" : user.followStatus === "REQUESTED" ? "Requested" : "Follow"} </button>
        }
      </div>

      <p className="text-gray-400 px-8">{user.status ?? "No status available"}</p>

      <div className="flex justify-between">
        <div>
            <span className='font-bold'>{user._count?.followers}</span> Followers
            <span className='font-bold ml-4'>{user._count?.following}</span> Following
        </div>
        <span className='text-gray-400'>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
      </div>
    </div>


  )
}

export default ProfileHeader