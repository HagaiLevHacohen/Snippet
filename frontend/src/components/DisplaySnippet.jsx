

function DisplaySnippet({ 
  profilePic,
  name,
  username,
  text, 
  time = "2h ago", 
  likes = 0,
  comments = 0
}) {
  return (
    <div className="max-w-md mx-auto p-4 bg-gray-800 border border-gray-700 rounded-xl shadow-md text-gray-100 space-y-3 hover:scale-105 hover:shadow-pink-400 hover:shadow transition">
      
      {/* Profile picture */}
      <div className="flex items-center space-x-3">
        <img 
          src={profilePic} 
          alt="Profile" 
          className="w-15 h-15 rounded-full object-cover border border-gray-600"
        />
        <span className="text-white">{name}</span>
        <span className="text-gray-400 text-sm">@{username} • {time}</span>
      </div>

      {/* Snippet text */}
      <p className="text-lg">{text}</p>

      {/* Comment section (display only) */}
      <div className="bg-gray-700 rounded-lg p-2 text-gray-300 text-sm">
        Write a comment...
      </div>

      {/* Footer with likes and comments */}
      <div className="flex items-center gap-4 mt-2">
        
        {/* Likes */}
        <div className="flex items-center gap-1 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current text-pink-500" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {likes}
        </div>

        {/* Comments */}
        <div className="flex items-center gap-1 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-current text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h6M21 15a4 4 0 01-4 4H7l-4 4V7a4 4 0 014-4h10a4 4 0 014 4v8z" />
          </svg>
          {comments}
        </div>

      </div>
    </div>
  )
}


export default DisplaySnippet;