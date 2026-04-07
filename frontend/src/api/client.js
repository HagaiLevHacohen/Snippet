let accessToken = null; // memory variable

export const setAccessToken = (token) => {
  accessToken = token;
};

const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = async (path, options = {}, retry = true) => {
  const headers = {
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers });

    if (res.status === 401 && retry) {
      // Try refreshing token via HTTP-only cookie
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) throw new Error("Refresh token failed");

      const data = await refreshRes.json();
      accessToken = data.data; // update memory token

      return apiClient(path, options, false); // retry original request
    }

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (err) {
    throw err;
  }
};