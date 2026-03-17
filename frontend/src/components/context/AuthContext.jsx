import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUserQueryOptions } from "../../queryOptions/authQueryOptions";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => Cookies.get("token") || null);
  const queryClient = useQueryClient();

  const {data: user, isLoading, isError, refetch} = useQuery(getCurrentUserQueryOptions(token));

  const login = async (newToken) => {
    Cookies.set("token", newToken, { expires: 7, sameSite: "strict" });
    setToken(newToken);
    await queryClient.invalidateQueries(["auth"]);
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