import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUserQueryOptions } from "../../queryOptions/authQueryOptions";
import { socket } from "../../lib/socket";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => Cookies.get("token") || null);
  const queryClient = useQueryClient();

  const {data, isLoading, isError, refetch} = useQuery(getCurrentUserQueryOptions(token));

  const user = data?.data; // extract user from response shape { success, message, data }

  useEffect(() => {
    if (!token && socket.connected) {
      socket.disconnect();
      return;
    } else if (!token) {
      return;
    }

    // If already connected, force reconnect with new auth
    if (socket.connected) {
      socket.disconnect();
    }

    socket.auth = { token };
    socket.connect();
  }, [token]);

  const login = async (newToken) => {
    Cookies.set("token", newToken, { expires: 7, sameSite: "strict" });
    setToken(newToken);
  };

  const logout = () => {
    Cookies.remove("token");
    setToken(null);
    queryClient.removeQueries(["auth"]); // clear cached user
  };

  const value = {
    token,
    user: user || null,
    loading: isLoading,
    isLoggedIn: !!user,
    login,
    logout,
    refetchUser: refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}