import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Spinner from "./Spinner";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Add loadingToken check
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size={12} color="purple" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute