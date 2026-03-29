import { apiClient } from "./client.js";


export async function getConversations() {
  const res = await apiClient(`/conversations`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch conversations");
  }
  return res.data;
}

export async function getMessages(conversationId, cursor = null) {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor);
  const res = await apiClient(`/conversations/${conversationId}/messages?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch messages");
  }
  return res.data;
}


export async function createConversation(recipientId) {
  const res = await apiClient(`/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipientId }),
  });
  if (!res.success) {
    throw new Error(res.message || "Failed to create conversation");
  }
  return res.data;
}
