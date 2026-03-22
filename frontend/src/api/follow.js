import { apiClient } from "./client.js";


export function createRequest({ recieverId }) {
  return apiClient(`/follow/${recieverId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
}
