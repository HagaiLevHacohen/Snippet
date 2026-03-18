import { apiClient } from "./client.js";

export async function getLikes({ userId, page = 1, limit = 20 }) {
  const query = new URLSearchParams({ page, limit }).toString();

  const res = await apiClient(`/users/${userId}/likes?${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.success) {
    throw new Error(res.message || "Failed to fetch users' likes");
  }

  const { posts, totalPages } = res.data;

  return {
    items: posts,
    nextPage: page < totalPages ? page + 1 : undefined,
  };
}