import { apiClient } from "./client";


export function getCurrentUser() {
  return apiClient("/auth/me");
}

export function loginRequest(formData) {
  return apiClient("/auth/login", {
    method: "POST",
    credentials: "include", // important for sending HTTP-only refresh cookie
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
}

export function signupRequest(formData) {
  return apiClient("/auth/signup", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
}

export function resendVerificationRequest({ email }) {
  return apiClient("/auth/resend-verification", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}
