import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import avatar from "../assets/avatars/avatar.png";

function ChatSidebar({ conversations, activeConversation, setActiveConversation }) {
  const { user } = useAuth();

  // Returns the other participant in a conversation
  const getOtherUser = (conversation) =>
    conversation.user1.id === user.id ? conversation.user2 : conversation.user1;

  return (
    <aside className="flex-2 flex flex-col bg-gray-800 text-white rounded-l-lg border-r-2 border-gray-700">
      {conversations.length > 0 ? (
        conversations.map((conversation) => {
          const other = getOtherUser(conversation);
          const isActive = activeConversation === conversation.id;

          return (
            <div
              key={conversation.id}
              onClick={() => setActiveConversation(conversation.id)}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200
                ${isActive ? 'border-green-500 border-2' : 'hover:bg-gray-700'}`}
            >
              {/* Avatar */}
              <img
                className="w-16 h-16 rounded-full object-cover shrink-0"
                src={other.avatarUrl ?? avatar}
                alt={other.username}
              />

              {/* Text container */}
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* User name */}
                <span className="text-white font-medium wrap-break-word">{other.name}</span>

                {/* Last message and optional timestamp */}
                {conversation.lastMessage ? (
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-gray-400 text-sm line-clamp-2 wrap-break-word">
                      {conversation.lastMessage.content}
                    </span>
                    {conversation.lastMessage.createdAt && (
                      <span className="text-gray-500 text-xs shrink-0">
                        {new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                ) : <div className="text-gray-400 text-sm">No messages yet</div>}
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-4 text-gray-400">No conversations yet.</div>
      )}
    </aside>
  );
}

export default ChatSidebar;