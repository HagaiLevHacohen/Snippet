import { useState, useRef, useEffect, use } from 'react';
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
  const containerRef = useRef(null);
  const [messageInput, setMessageInput] = useState("");
  const [newMessages, setNewMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);


  // Fetching messages logic with react-query's useInfiniteQuery
  const fetcher = ({ pageParam = null }) => {
    return getMessages(conversation.id, pageParam);
  };

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} = useInfiniteQuery({
    queryKey: ['messages', conversation.id],
    queryFn: fetcher,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    keepPreviousData: true,
  });

  // Creating messages list
  const messages = data?.pages?.flatMap(page => page.messages) || [];
  messages.reverse(); // reverse to show newest at the bottom
  messages.push(...newMessages); // append new messages to the end



  const loadMoreMessages = async () => {
    const el = containerRef.current;
    if (!el) return;

    const prevScrollHeight = el.scrollHeight;

    await fetchNextPage(); // fetch older messages

    // Wait for DOM to update
    requestAnimationFrame(() => {
      const newScrollHeight = el.scrollHeight;
      el.scrollTop = newScrollHeight - prevScrollHeight; // keep viewport stable
    });
  };

  // Intersection Observer
  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) { // load more when the sentinel comes into view
        loadMoreMessages();
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current); // start observing the sentinel
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  // Check if user is near the bottom of the chat
  const isNearBottom = (el) => {
    return el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  };

  // Scroll to bottom when new messages arrive, but only if user is already near the bottom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isNearBottom(el)) {
      el.scrollTop = el.scrollHeight;
    }
  }, [newMessages]);


  const sendMessageHandler = () => {
    socket.emit("send_message", { conversationId: conversation.id, content: messageInput.trim() });
    setMessageInput("");
  }

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.conversationId !== conversation.id) return; // ignore messages from other conversations
      setNewMessages((prev) => [...prev, message]);
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [conversation.id]);

  useEffect(() => {
    const handleMessageRead = (conversationId) => {
      if (conversationId !== conversation.id) return; // ignore messages from other conversations
      setNewMessages((prev) => prev.map(msg => ({ ...msg, isRead: true })));
    };

    socket.on("messages_read", handleMessageRead);

    return () => {
      socket.off("messages_read", handleMessageRead);
    };
  }, [conversation.id]);

  useEffect(() => {
    socket.emit("mark_as_read", { conversationId: conversation.id});
  }, [conversation.id, newMessages.length]);


  useEffect(() => {
    const handleTyping = (conversationId) => {
      if (conversationId !== conversation.id) return; // ignore typing events from other conversations
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000); // reset typing status after 3 seconds
    };

    socket.on("typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping);
    };
  }, [conversation.id]);


  const didInitialScroll = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!didInitialScroll.current && data?.pages?.length) {
      el.scrollTop = el.scrollHeight;
      didInitialScroll.current = true;
    }
  }, [data?.pages?.length]);



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
      <div ref={containerRef} className='flex-1 flex flex-col p-4 overflow-auto'>
        {/* Sentinel + Spinner */}
        <div ref={observerRef} className="h-10 flex m-b-auto justify-center items-center">
          {isFetchingNextPage && <Spinner />}
          {!hasNextPage && (
            <p className="text-center text-gray-400 py-4">
              The beginning of the conversation
            </p>
          )}
        </div>

        {/* Messages */}
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="text-gray-400 text-sm italic mb-2">
            {other.name} is typing...
          </div>
        )}
      </div>

      {/* Input area */}
      <div className='p-4 border-t border-gray-700'>
        
        <div className='flex items-center gap-2'>
          <input onKeyDown={(e) => {
              if (e.key === "Enter" && messageInput.trim()) {
                sendMessageHandler();
              }
            }}
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              socket.emit("typing", { conversationId: conversation.id }); // emit typing event on input change
            }}
            className='w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none'
          />
          <button className={`rounded-full bg-green-700 p-2 active:bg-green-600 ${messageInput ? 'opacity-100' : 'opacity-50'}`} disabled={!messageInput} onClick={sendMessageHandler}>
            <img src={sendIcon} alt="Send" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat