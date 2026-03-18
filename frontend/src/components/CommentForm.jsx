import { useState, useRef } from "react";
import { createComment } from "../api/comment";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

function CommentForm({ postId }) {
  const [isActive, setIsActive] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [errors, setErrors] = useState({});
  const textareaRef = useRef(null);

  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      toast.success("Comment created successfully!");
      setCommentContent("");
      setErrors({});
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
        toast.error(err.message || "Comment creation failed. Please try again.");
      }
    },
  });


  const handleChange = (e) => {
    setCommentContent(e.target.value);

    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleCancel = () => {
    setIsActive(false);
    setCommentContent("");
    setErrors({});

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(postId, commentContent);
    handleCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        ref={textareaRef}
        name="content"
        placeholder="Write a comment..."
        value={commentContent}
        onChange={handleChange}
        onFocus={() => setIsActive(true)}
        rows={1}
        maxLength={500}
        required
        className="w-full bg-gray-700 rounded-lg p-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none overflow-hidden"
      />
      {Object.values(errors).map((error, index) => (
        <p key={index} className="text-red-500 text-sm font-bold"> • {error} </p>))}

      {isActive && (
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="h-10 w-24 bg-violet-500 rounded-lg hover:bg-violet-600 text-white"
          >
            Comment
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="hover:bg-gray-600 h-10 w-20 rounded-2xl"
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  );
}

export default CommentForm;