import { useState } from 'react'
import { useAuth } from "./context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import avatar from "../assets/avatars/avatar.png";
import { createRequest, deleteFollow } from '../api/follow';
import toast from "react-hot-toast";
import { Link } from 'react-router-dom';
import { createConversation } from '../api/conversation';

function ProfileHeader({ user }) {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();
  const isOwnProfile = user?.username === authUser?.username;

const followMutation = useMutation({
  mutationFn: ({ action, receiverId }) => {
    if (action === "follow") {
      return createRequest(receiverId);
    }

    if (action === "unfollow") {
      return deleteFollow(receiverId);
    }

    throw new Error("Invalid action");
  },

  onSuccess: (_, variables) => {
    const { action } = variables;

    toast.success(
      action === "follow"
        ? "Follow request sent"
        : "Unfollowed successfully"
    );

    queryClient.invalidateQueries({ queryKey: ["user", user.username] });
  },

  onError: () => {
    toast.error("Error processing request");
  },
});


const createConversationMutation = useMutation({
  mutationFn: ({ recipientId }) => {
    return createConversation(recipientId);
  },

  onSuccess: () => {
    toast.success("Conversation created successfully");
  },

  onError: () => {
    toast.error("Error creating conversation");
  },
});


  const handleFollowClick = (action) => {
    followMutation.mutate({action, receiverId: user.id});
  };


  return (
    <div className='flex flex-col w-full xl:w-7/10 xl:min-w-75 bg-gray-800 rounded-lg p-4 gap-8'>

      <div className='flex w-full items-center justify-between gap-10'>
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
                <h2 className="text-sm md:text-lg text-gray-400">@{user.username}</h2>
            </div>
        </div>
        {isOwnProfile ? 
        <Link to="/settings" className='h-10 sm:w-30 bg-violet-500 hover:bg-violet-600 text-white p-2 text-center rounded-lg'>Edit Profile</Link>
        :
        <div className='flex flex-col sm:flex-row gap-4'>
          <button onClick={() => createConversationMutation.mutate({ recipientId: user.id })} className='h-10 sm:w-30 bg-violet-500 hover:bg-violet-600 text-white px-3 py-1 rounded-lg'>Message</button>
          <button onClick={user.followStatus === "FOLLOWING"? () => handleFollowClick("unfollow") : () => handleFollowClick("follow")} className={`h-10 sm:w-30 ${user.followStatus === "FOLLOWING" ? 'bg-gray-500 hover:bg-red-600' : 'bg-violet-500 hover:bg-violet-600'} text-white px-3 py-1 rounded-lg`}>   {user.followStatus === "FOLLOWING" ? "Following" : user.followStatus === "REQUESTED" ? "Requested" : "Follow"} </button>
        </div>
        }
      </div>

      <p className="text-gray-400 px-8">{user.status ?? "No status available"}</p>

      <div className="flex justify-between text-sm">
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