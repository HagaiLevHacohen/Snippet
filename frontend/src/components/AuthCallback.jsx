import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("[AuthCallback] Received token:", token);

    if (!token) return;

    login(token);
    toast.success("Logged in successfully!");
    navigate("/feed", { replace: true });
  }, [login, navigate]);

  return <p>Logging you in...</p>;
}