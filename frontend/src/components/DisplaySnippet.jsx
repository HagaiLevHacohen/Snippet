

function DisplaySnippet({ 
  profilePic, 
  text, 
  time = "2h ago", 
  likes = 0 
}) {
  return (
    <div className="max-w-md mx-auto p-4 bg-gray-800 border border-gray-700 rounded-xl shadow-md text-gray-100 space-y-3">
      
      {/* Profile picture */}
      <div className="flex items-center space-x-3">
        <img 
          src={profilePic} 
          alt="Profile" 
          className="w-10 h-10 rounded-full object-cover border border-gray-600"
        />
        <span className="text-gray-400 text-sm">{time}</span>
      </div>

      {/* Snippet text */}
      <p className="text-lg">{text}</p>

      {/* Comment section (display only) */}
      <div className="bg-gray-700 rounded-lg p-2 text-gray-300 text-sm">
        Write a comment...
      </div>

      {/* Footer with likes */}
      <div className="flex items-center mt-2">
        <div className="flex items-center gap-1 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current text-pink-500" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {likes}
        </div>
      </div>
    </div>
  )
}


export default DisplaySnippet;