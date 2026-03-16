import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { apiFetch } from "../../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => Cookies.get("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we know auth status

  // Fetch user data using a token
  const fetchUser = async (currentToken) => {
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch("/auth/me", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      setUser(data.data);
    } catch (err) {
      console.error("fetchUser error:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login: store token and fetch user
  const login = async (newToken) => {
    Cookies.set("token", newToken, { expires: 7, sameSite: "strict" });
    setToken(newToken);
    await fetchUser(newToken); // wait until user is fetched
  };

  // Logout: remove token and clear user
  const logout = () => {
    Cookies.remove("token");
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  // Whenever token changes (including on mount), fetch user if token exists.
  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const value = {
    token,
    user,
    loading,
    isLoggedIn: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}