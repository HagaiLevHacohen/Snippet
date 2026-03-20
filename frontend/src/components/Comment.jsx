import avatar from "../assets/avatars/avatar.png";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

function Comment({ item }) {
  return (
    <div className="flex gap-3 px-4 py-3 border-b border-gray-700 hover:bg-gray-800/40 transition">
      
      {/* Avatar */}
      <img
        src={item.user.avatarUrl || avatar}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover border border-gray-600"
      />

      {/* Content */}
      <div className="flex flex-col flex-1">
        
        {/* Header */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white font-medium">
            {item.user.name}
          </span>
          <span className="text-gray-400">
            @{item.user.username} • {format(item.createdAt)}
          </span>
          {item.post && (
            <Link to={`/posts/${item.post.id}`} className="text-blue-500 ml-auto text-xs">
              replied to {item.post.user.name}'s post
            </Link>
          )}
        </div>

        {/* Text */}
        <p className="text-lg pl-4 whitespace-pre-wrap wrap-break-word break-all">
          {item.content}
        </p>
      </div>
    </div>
  );
}

export default Comment;