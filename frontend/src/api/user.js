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