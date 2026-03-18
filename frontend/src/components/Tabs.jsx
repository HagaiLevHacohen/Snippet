import { useState } from 'react'

function Tabs({ activeTab, setActiveTab }) {
    const [count, setCount] = useState(0)

    const isPostsActive = activeTab === "posts";
    const isCommentsActive = activeTab === "comments";
    const isLikesActive = activeTab === "likes";

    return (
        <div className='flex border-b h-12 border-gray-700'>
            <div onClick={() => setActiveTab("posts")} className={`flex-1 ${isPostsActive ? 'bg-indigo-500 ' : 'hover:bg-gray-600'} rounded-tl-md flex border-r border-gray-700 justify-center items-center transition-colors duration-300`}>Posts</div>
            <div onClick={() => setActiveTab("comments")} className={`flex-1 ${isCommentsActive ? 'bg-indigo-500' : 'hover:bg-gray-600'} flex border-r border-gray-700 justify-center items-center transition-colors duration-300`}>Comments</div>
            <div onClick={() => setActiveTab("likes")} className={`flex-1 rounded-tr-md ${isLikesActive ? 'bg-indigo-500' : 'hover:bg-gray-600'} flex border-r border-gray-700 justify-center items-center transition-colors duration-300`}>Likes</div>
        </div>
    )
}

export default Tabs