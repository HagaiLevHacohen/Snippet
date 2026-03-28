import { useState, useEffect, use } from "react";
import { useAuth } from "./context/AuthContext";
import ChatSidebar from "./ChatSidebar";
import Chat from "./Chat";
import { useQuery } from "@tanstack/react-query";
import { getConversationsQueryOptions } from "../queryOptions/conversationQueryOptions";
import Spinner from "./Spinner";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;
export const socket = io(API_URL, {
  autoConnect: false, // important
});

function MessagePage() {
  const [activeConversation, setActiveConversation] = useState(null);
  const { token } = useAuth();
  const {data: conversations, isLoading, isError, refetch} = useQuery(getConversationsQueryOptions());

  // Connect socket
  useEffect(() => {
    if (!token) return;

    socket.auth = { token };
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [token]);


  // Join conversations on connect
  useEffect(() => {
    const handleConnect = () => {
      socket.emit("join_conversations");
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, []);


  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <div className="text-red-500">Error loading conversations. Please try again.</div>;
  }

  return (
    <div className="h-screen w-full flex items-center justify-center gap-4 px-32 pt-4 overflow-auto">
        <div className="flex w-7/10 min-w-75 h-8/10 bg-gray-800 rounded-lg">
            <ChatSidebar conversations={conversations} activeConversation={activeConversation} setActiveConversation={setActiveConversation} />
            <Chat activeConversation={activeConversation} />
        </div>
    </div>
  );
}

export default MessagePage;