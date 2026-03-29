import { useState, useRef, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import avatar from "../assets/avatars/avatar.png";
import {useInfiniteQuery } from "@tanstack/react-query";
import { getMessages } from '../api/conversation';
import toast from "react-hot-toast";
import Message from './Message';
import Spinner from './Spinner';
import sendIcon from "../assets/icons/message-send.png";
import { socket } from '../lib/socket';

function Chat({ conversation }) {
  const { user } = useAuth();
  const observerRef = useRef();
  const [messageInput, setMessageInput] = useState("");

  const fetcher = ({ pageParam = null }) => {
    return getMessages(conversation.id, pageParam);
  };

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} = useInfiniteQuery({
    queryKey: ['messages', conversation.id],
    queryFn: fetcher,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    keepPreviousData: true,
  });

  // Intersection Observer
  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) { // load more when the sentinel comes into view
        fetchNextPage();
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current); // start observing the sentinel
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sendMessageHandler = () => {
    socket.emit("send_message", { conversationId: conversation.id, content: messageInput }, (response) => {
      if (response.success) {
        setMessageInput("");
      } else {
        toast.error("Error sending message");
      }
    });
  }


  // Returns the other participant in a conversation
  const getOtherUser = (conversation) =>
    conversation.user1.id === user.id ? conversation.user2 : conversation.user1;

  const other = getOtherUser(conversation);

  return (
    <div className='flex-5 flex flex-col text-white rounded-lg'>
      {/* Header */}
      <div className='flex items-center gap-4 p-4 border-b border-gray-700'>
              {/* Avatar */}
              <img
                className="w-16 h-16 rounded-full object-cover shrink-0"
                src={other.avatarUrl ?? avatar}
                alt={other.username}
              />

              {/* User name */}
              <span className="text-white font-medium wrap-break-word">{other.name}</span>
      </div>

      {/* Messages area */}
      <div className='flex-1 flex flex-col p-4 overflow-auto'>
        {/* Sentinel + Spinner */}
        <div ref={observerRef} className="h-10 flex m-b-auto justify-center items-center">
          {isFetchingNextPage && <Spinner />}
          {!hasNextPage && (
            <p className="text-center text-gray-400 py-4">
              No more messages
            </p>
          )}
        </div>

        {/* Messages */}
        {data?.pages?.length > 0 && (
          data.pages.map((page) =>
            page.messages.map((message) => {
              return (
                <Message key={message.id} message={message} />
              );
            })
          )
        )}
      </div>

      {/* Input area */}
      <div className='p-4 border-t border-gray-700'>
        
        <div className='flex items-center gap-2'>
          <input
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className='w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none'
          />
          <button className={`rounded-full bg-green-700 p-2 ${messageInput ? 'opacity-100' : 'opacity-50'}`} disabled={!messageInput} onClick={sendMessageHandler}>
            <img src={sendIcon} alt="Send" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat