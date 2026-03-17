import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = async (path, options = {}) => {
  const token = Cookies.get("token");

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

   const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
};