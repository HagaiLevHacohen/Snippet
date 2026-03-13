import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize token from cookie
  const [token, setToken] = useState(() => Cookies.get("token") || null);

  const login = (newToken) => {
    // Set cookie with optional expiration (e.g., 7 days)
    Cookies.set("token", newToken, { expires: 7, sameSite: "strict" });
    setToken(newToken);
  };

  const logout = () => {
    Cookies.remove("token");
    setToken(null);
  };

  const value = {
    token,
    isLoggedIn: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}