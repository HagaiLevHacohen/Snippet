import { useEffect } from 'react';
import { socket } from '../lib/socket';

export default function useChatSocket(conversationId, { onNewMessage, onMessagesRead, onTyping } = {}) {
  useEffect(() => {
    if (!conversationId) return;

    const handleNewMessage = (message) => {
      if (message.conversationId !== conversationId) return;
      onNewMessage?.(message);
    };

    const handleMessagesRead = (id) => {
      if (id !== conversationId) return;
      onMessagesRead?.(id);
    };

    const handleTyping = (id) => {
      if (id !== conversationId) return;
      onTyping?.(id);
    };

    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);
    socket.on('typing', handleTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
      socket.off('typing', handleTyping);
    };
  }, [conversationId, onNewMessage, onMessagesRead, onTyping]);

  const sendMessage = (content) => {
    socket.emit('send_message', { conversationId, content });
  };

  const markAsRead = () => {
    socket.emit('mark_as_read', { conversationId });
  };

  const emitTyping = () => {
    socket.emit('typing', { conversationId });
  };

  return { sendMessage, markAsRead, emitTyping };
}
