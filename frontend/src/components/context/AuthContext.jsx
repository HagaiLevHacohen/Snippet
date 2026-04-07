// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUserQueryOptions } from "../../queryOptions/authQueryOptions";
import { socket } from "../../lib/socket";
import { setAccessToken } from "../../api/client";

const AuthContext = createContext(null);

// SINGLETON refresh promise (outside component)
let refreshInProgress = null;

// This function handles rotating refresh tokens safely
async function refreshToken(setToken) {
  if (refreshInProgress) return refreshInProgress; // return existing in-flight request

  refreshInProgress = fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then(async res => {
      if (!res.ok) return null; // treat as not logged in
      return res.json();
    })
    .then(data => {
      if (data?.data) setToken(data.data);
    })
    .finally(() => {
      refreshInProgress = null; // allow next request
    });

  return refreshInProgress;
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery(getCurrentUserQueryOptions(token));
  const user = data?.data;

  const setToken = (newToken) => {
    setTokenState(newToken);
    setAccessToken(newToken);
  };

  useEffect(() => {
    if (!token) {
      if (socket.connected) socket.disconnect();
      return;
    }

    if (!socket.connected || socket.auth?.token !== token) {
      if (socket.connected) socket.disconnect();
      socket.auth = { token };
      socket.connect();
    }
  }, [token]);

  // Auto-refresh token on app start
  useEffect(() => {
    refreshToken(setToken).finally(() => setLoadingToken(false));
  }, []);

  const login = (newToken) => setToken(newToken);

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setToken(null);
    queryClient.removeQueries(["auth"]);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user: user || null,
        loading: isLoading || loadingToken,
        isLoggedIn: !!user,
        login,
        logout,
        refetchUser: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}