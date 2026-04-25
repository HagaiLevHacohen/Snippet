import Message from './Message';
import Spinner from './Spinner';

export default function MessageList({ messages, observerRef, isFetchingNextPage, hasNextPage, other, isTyping, containerRef }) {
  return (
    <div ref={containerRef} className='flex-1 flex flex-col p-4 overflow-auto'>
      <div ref={observerRef} className="h-10 flex m-b-auto justify-center items-center">
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && (
          <p className="text-center text-gray-400 py-4">
            The beginning of the conversation
          </p>
        )}
      </div>

      {messages.map((message) => (
        <Message key={message.clientId} message={message} />
      ))}

      {isTyping && (
        <div className="text-gray-400 text-sm italic mb-2">
          {other.name} is typing...
        </div>
      )}
    </div>
  );
}
