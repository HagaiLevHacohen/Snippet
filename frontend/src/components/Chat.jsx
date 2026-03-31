import { useState, useRef, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import avatar from "../assets/avatars/avatar.png";
import {useInfiniteQuery } from "@tanstack/react-query";
import { getMessages } from '../api/conversation';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import useChatSocket from '../hooks/useChatSocket';

function Chat({ conversation }) {
  const { user } = useAuth();
  const observerRef = useRef();
  const containerRef = useRef(null);
  const [newMessages, setNewMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Fetching messages logic with react-query's useInfiniteQuery
  const fetcher = ({ pageParam = null }) => {
    return getMessages(conversation.id, pageParam);
  };

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
    queryKey: ['messages', conversation.id],
    queryFn: fetcher,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    keepPreviousData: true,
  });

  // Creating messages list
  const fetched = data?.pages?.flatMap(page => page.messages) || [];
  const messages = [...fetched].reverse(); // reverse to show newest at the bottom
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

  // Socket handlers are centralized in the hook
  const { sendMessage, markAsRead, emitTyping } = useChatSocket(conversation.id, {
    onNewMessage: (message) => {
      setNewMessages((prev) => [...prev, message]);
    },
    onMessagesRead: () => {
      setNewMessages((prev) => prev.map(msg => ({ ...msg, isRead: true })));
    },
    onTyping: () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }
  });

  useEffect(() => {
    markAsRead();
  }, [conversation.id, newMessages.length]);

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
      <MessageList
        messages={messages}
        observerRef={observerRef}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        other={other}
        isTyping={isTyping}
        containerRef={containerRef}
      />

      <ChatInput onSend={(content) => sendMessage(content)} onTyping={() => emitTyping()} />
    </div>
  )
}

export default Chat