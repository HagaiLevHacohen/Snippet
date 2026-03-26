import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../api/user";
import avatar from "../assets/avatars/avatar.png";
import toast from "react-hot-toast";

function Settings() {
  const { user, refetchUser } = useAuth();

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [avatarFile, setAvatarFile] = useState(null); // file object
  const [avatarPreview, setAvatarPreview] = useState(""); // preview URL

  useEffect(() => {
    setName(user?.name ?? "");
    setStatus(user?.status ?? "");
    setAvatarPreview(user?.avatarUrl ?? "");
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  // One mutation for both steps
  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Profile updated");
      if (refetchUser) refetchUser();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update profile");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user?.id) return toast.error("No authenticated user");

    mutation.mutate({ id: user.id, name, status, avatarFile });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);

    // preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Settings</h2>
          <p className="text-sm text-zinc-400">Update your profile information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Name</label>
            <input
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Status</label>
            <input
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="What's on your mind?"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>

          {/* Avatar file input */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-zinc-400 file:bg-indigo-600 file:text-white file:px-3 file:py-2 file:rounded-lg"
            />
          </div>

          {/* Preview */}
          {avatarPreview && (
            <div className="flex items-center gap-3 pt-2">
              <img
                src={avatarPreview ?? avatar}
                alt="avatar preview"
                className="w-12 h-12 rounded-full object-cover border border-zinc-700"
              />
              <span className="text-sm text-zinc-400">Preview</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-medium transition"
          >
            {mutation.isLoading ? "Saving..." : "Confirm Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;