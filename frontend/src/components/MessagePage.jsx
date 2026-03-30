import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import ChatSidebar from "./ChatSidebar";
import Chat from "./Chat";
import { useQuery } from "@tanstack/react-query";
import { getConversationsQueryOptions } from "../queryOptions/conversationQueryOptions";
import Spinner from "./Spinner";

function MessagePage() {
  const [activeConversation, setActiveConversation] = useState(null);
  const { token } = useAuth();
  const { data: conversations, isLoading, isError, refetch } = useQuery(getConversationsQueryOptions());

  if (isLoading) return <Spinner />;

  if (isError) {
    return <div className="text-red-500">Error loading conversations. Please try again.</div>;
  }

  // Find the currently active conversation safely
  const currentConversation = conversations.find(c => c.id === activeConversation);

  return (
    <div className="h-screen w-full flex justify-center items-start gap-4 px-4 md:px-32 pt-4 overflow-auto bg-gray-900">
      <div className="flex w-full max-w-6xl h-[80vh] bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <ChatSidebar
          conversations={conversations}
          activeConversation={activeConversation}
          setActiveConversation={setActiveConversation}
        />

        {/* Main chat area */}
        {currentConversation ? (
          <Chat key={currentConversation.id} conversation={currentConversation} />
        ) : (
          <div className="flex-5 flex items-center justify-center text-gray-400">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagePage;