import { useState } from 'react';
import sendIcon from "../assets/icons/message-send.png";

export default function ChatInput({ onSend, onTyping }) {
  const [messageInput, setMessageInput] = useState("");

  const handleSend = () => {
    const trimmed = messageInput.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setMessageInput("");
  };

  return (
    <div className='p-4 border-t border-gray-700'>
      <div className='flex items-center gap-2'>
        <input onKeyDown={(e) => {
            if (e.key === "Enter" && messageInput.trim()) {
              handleSend();
            }
          }}
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
            onTyping?.();
          }}
          className='w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none'
        />
        <button className={`rounded-full bg-green-700 p-2 active:bg-green-600 ${messageInput ? 'opacity-100' : 'opacity-50'}`} disabled={!messageInput} onClick={handleSend}>
          <img src={sendIcon} alt="Send" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
