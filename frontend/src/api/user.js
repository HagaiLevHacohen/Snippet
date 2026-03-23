import { apiClient } from "./client.js";


export function getUserByUsername({ username }) {
  return apiClient(`/users/username/${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}


export function getFollowRequests() {
  return apiClient(`/users/follow-requests`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}


export function getFollowing(userId) {
  return apiClient(`/users/${userId}/following`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export function getFollowers(userId) {
  return apiClient(`/users/${userId}/followers`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function getUsers ({ page = 1, limit = 20, search }) {
  const params = new URLSearchParams();
  if (search !== undefined) params.append("search", search);

  params.append("page", page);
  params.append("limit", limit);

  const res = await apiClient(`/users?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.success) {
    throw new Error(res.message || "Failed to fetch users");
  }

  const { users, totalPages } = res.data;

  return {
    items: users ?? [],
    nextPage: page < totalPages ? page + 1 : undefined,
  };
}