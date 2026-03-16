import { useState } from 'react'
import { useParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import avatar from "../assets/avatars/avatar.png";

function ProfileHeader() {
  const { user } = useAuth();
  const { username } = useParams();
  const isOwnProfile = user?.username === username;


  return (
    <div className='flex flex-col w-200 bg-gray-800 rounded-lg p-4 gap-8'>

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
        <button className='h-10 bg-violet-500 hover:bg-violet-600 text-white px-3 py-1 rounded-lg'>Follow</button>}
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