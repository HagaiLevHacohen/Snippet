import { useAuth } from './context/AuthContext';
import avatar from "../assets/avatars/avatar.png";
import { format } from 'timeago.js';
import toast from "react-hot-toast";

function Message({ message }) {
    const { user } = useAuth();
    const isOwnMessage = message.senderId === user.id;
    return (
        <div
            className={`flex flex-col max-w-xs p-2 rounded-lg mb-2
            ${isOwnMessage ? 'bg-green-800 self-end' : 'bg-gray-700 self-start'}`}
        >
            <span>{message.content}</span>

            <div className={`flex ${isOwnMessage ? 'justify-between' : 'justify-end'} gap-2`}>
                { isOwnMessage &&
                <span className="text-gray-400 text-xs mt-1 self-end">{message.isRead ? "Read" : "Sent"}</span>
                }
                <span className="text-gray-200 text-xs mt-1 self-end">
                {format(new Date(message.createdAt))}
                </span>
            </div>

        </div>
    );
}

export default Message