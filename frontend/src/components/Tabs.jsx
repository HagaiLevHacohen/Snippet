

function Tabs({ activeTab, setActiveTab, page }) {
    
    return (
        <div className='flex border-b h-12 border-gray-700'>
            { page === 'profile' ? <>
            <div onClick={() => setActiveTab("posts")} className={`flex-1 ${activeTab === "posts" ? 'bg-indigo-500 ' : 'hover:bg-gray-600'} rounded-tl-md flex border-r border-gray-700 justify-center items-center transition-colors duration-300`}>Posts</div>
            <div onClick={() => setActiveTab("comments")} className={`flex-1 ${activeTab === "comments" ? 'bg-indigo-500' : 'hover:bg-gray-600'} flex border-r border-gray-700 justify-center items-center transition-colors duration-300`}>Comments</div>
            <div onClick={() => setActiveTab("likes")} className={`flex-1 ${activeTab === "likes" ? 'bg-indigo-500' : 'hover:bg-gray-600'} rounded-tr-md flex border-r border-gray-700 justify-center items-center transition-colors duration-300`}>Likes</div>
            </> :
            <>
            <div onClick={() => setActiveTab("recent")} className={`flex-1 ${activeTab === "recent" ? 'bg-indigo-500 ' : 'hover:bg-gray-600'} rounded-tl-md flex border-r border-gray-700 justify-center items-center transition-colors duration-300`}>Recent</div>
            <div onClick={() => setActiveTab("followingPosts")} className={`flex-1 ${activeTab === "followingPosts" ? 'bg-indigo-500' : 'hover:bg-gray-600'} rounded-tr-md flex border-r border-gray-700 justify-center items-center transition-colors duration-300`}>Following Posts</div>
            </>
            } 
        </div>
    )
}

export default Tabs