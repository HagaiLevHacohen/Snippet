import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (path, options = {}) => {
  const token = Cookies.get("token");

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
};