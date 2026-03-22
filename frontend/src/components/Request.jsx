import { useState } from "react";

function Request({ sender, page }) {
  const [loading, setLoading] = useState(false);

  const statusColors = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    ACCEPTED: "bg-green-500/20 text-green-400 border-green-500/30",
    REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-750 transition-colors">
      
      {/* LEFT: Avatar + Info */}
      <div className="flex items-center gap-3">
        <img
          src={sender.avatarUrl}
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
              disabled={loading}
              className="px-3 py-1 text-sm rounded-md bg-green-600 hover:bg-green-500 transition disabled:opacity-50"
            >
              Accept
            </button>
            <button
              disabled={loading}
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
            Following
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