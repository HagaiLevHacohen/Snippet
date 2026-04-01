import { useState, useRef, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import avatar from "../assets/avatars/avatar.png";

function ChatSidebar({ conversations, activeConversation, setActiveConversation  , sidebarOpen, setSidebarOpen, buttonRef }) {
  const { user } = useAuth();
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside (ignores button)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        buttonRef?.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [sidebarOpen, setSidebarOpen, buttonRef]);

  // Returns the other participant in a conversation
  const getOtherUser = (conversation) =>
    conversation.user1.id === user.id ? conversation.user2 : conversation.user1;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen
            ? "opacity-100 visible backdrop-blur-sm bg-[rgba(0,0,0,0.2)] pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
      ></div>


      <aside ref={sidebarRef} className={`${sidebarOpen ? "fixed z-50 top-0 right-0 w-64 h-screen min-h-screen": "flex-2 hidden"} md:flex md:flex-col bg-gray-800 text-white rounded-l-lg border-r-2 border-gray-700`}>
        {conversations.length > 0 ? (
          conversations.map((conversation) => {
            const other = getOtherUser(conversation);
            const isActive = activeConversation === conversation.id;

            return (
              <div
                key={conversation.id}
                onClick={() => { setActiveConversation(conversation.id); setSidebarOpen(false); }}
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
    </>
  );
}

export default ChatSidebar;