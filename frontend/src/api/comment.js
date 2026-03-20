import { apiClient } from "./client.js";


export function createComment({ postId, content }) {
  return apiClient(`/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

export async function getComments({ userId, page = 1, limit = 20}) {
  const params = new URLSearchParams();

  if (userId !== undefined) params.append("userId", userId);

  params.append("page", page);
  params.append("limit", limit);

  const res = await apiClient(`/comments?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.success) {
    throw new Error(res.message || "Failed to fetch comments");
  }

  const { comments, totalPages } = res.data;

  return {
    items: comments ?? [],
    nextPage: page < totalPages ? page + 1 : undefined,
  };
}