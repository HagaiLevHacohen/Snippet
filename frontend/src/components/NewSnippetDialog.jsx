import { useState } from "react";
import {createPost} from "../api/post";
import { useAuth } from "./context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function NewSnippetDialog({ onClose }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post created successfully!");
      setContent("");
      setErrors({});
      onClose();
      queryClient.resetQueries(["posts", user.id], { exact: true });
    },
    onError: (err) => {
      if (err?.errors) {
        // API validation errors
        const apiErrors = {};
        err.errors.forEach((e) => {
          apiErrors[e.path] = e.msg;
        });
        setErrors(apiErrors);
      } else {
        toast.error(err.message || "Signup failed. Please try again.");
      }
    },
  });

  const validateForm = () => {
    const newErrors = {};
    const trimmedContent = content.trim();
    if (!trimmedContent) newErrors.content = "Content is required";
    else if (trimmedContent.length > 500) newErrors.content = "Content must be at most 500 characters";
    return newErrors;
  }

  const handlePost = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      mutation.mutate({content}); // imageUrl is required by API but we don't support it in UI, so we just send content and let backend handle the rest
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
        {Object.values(errors).map((error, index) => (
          <p key={index} className="text-red-500 text-sm font-bold">
            • {error}
          </p>
        ))}
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
            className="px-4 py-2 bg-violet-500 rounded-lg hover:bg-violet-600 text-white disabled:opacity-50 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}