const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (path, options = {}) => {
  return await fetch(`${API_URL}${path}`, options);
};