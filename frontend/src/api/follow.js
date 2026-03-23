import { apiClient } from "./client.js";


export function createRequest(recieverId) {
  return apiClient(`/follow/${recieverId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
}

export function deleteFollow(recieverId) {
  return apiClient(`/follow/${recieverId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

export function acceptRequest(userId) {
  return apiClient(`/follow/${userId}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
}

export function rejectRequest(userId) {
  return apiClient(`/follow/${userId}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
}