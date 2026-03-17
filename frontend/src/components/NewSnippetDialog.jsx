import { useState } from "react";

export default function NewSnippetDialog({ onClose }) {
  const [content, setContent] = useState("");

  const handlePost = () => {
    if (content.trim()) {
      // TODO: Submit the snippet
      console.log("Posting snippet:", content);
      setContent("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Light translucent overlay */}
      <div
        className="fixed inset-0 backdrop-blur-sm z-40 bg-[rgba(0,0,0,0.2)]"
        onClick={onClose}
      ></div>

      {/* Dialog card */}
      <div className="relative bg-gray-800 rounded-xl shadow-2xl w-130 max-w-[90%] p-6 flex flex-col animate-fade-in z-50">
        <h2 className="text-2xl font-bold text-white mb-4">New Snippet</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-40 p-3 rounded-lg bg-gray-700 text-white resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="Write something..."
        ></textarea>
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={handlePost}
            disabled={!content.trim()}
            className="px-4 py-2 bg-violet-500 rounded-lg hover:bg-violet-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}