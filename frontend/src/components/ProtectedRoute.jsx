import { Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";

export function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth(); // check auth state

  if (!isLoggedIn) {
    return <Navigate to="/login" />; // redirect if not logged in
  }

  return children; // render the protected component if logged in
}