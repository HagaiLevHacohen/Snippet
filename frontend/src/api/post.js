import { apiClient } from "./client.js";


export async function createPost({ content, imageFile }) {
  let imageUrl;

  // Step 1: upload image if a file is selected
  if (imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile);

    const uploadRes = await apiClient("/upload/post-image", {
      method: "POST",
      body: formData,
    });

    imageUrl = uploadRes.url;
  }

  // Step 2: create post
  return apiClient("/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: content || undefined,
      ...(imageUrl && { imageUrl }),
    }),
  });
}


export async function getPost(postId) {
  const res = await apiClient(`/posts/${postId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch posts");
  }
  return res.data;
}



export async function getPosts({ userId, page = 1, limit = 20, section, search }) {
  const params = new URLSearchParams();

  if (userId !== undefined) params.append("userId", userId);
  if (section !== undefined) params.append("section", section);
  if (search !== undefined) params.append("search", search);

  params.append("page", page);
  params.append("limit", limit);

  const res = await apiClient(`/posts?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.success) {
    throw new Error(res.message || "Failed to fetch posts");
  }

  const { posts, totalPages } = res.data;

  return {
    items: posts ?? [],
    nextPage: page < totalPages ? page + 1 : undefined,
  };
}