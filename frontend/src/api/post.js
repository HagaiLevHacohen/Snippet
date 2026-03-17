import { apiClient } from "./client.js";


export function createPost(formData) {
  return apiClient("/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
}
