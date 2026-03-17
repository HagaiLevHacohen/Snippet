import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Spinner from "./Spinner";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-black">
        <Spinner size={12} color="purple" />
      </div>
    );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children; // render the protected component if logged in
}

export default ProtectedRoute