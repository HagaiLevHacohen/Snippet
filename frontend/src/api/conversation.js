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
