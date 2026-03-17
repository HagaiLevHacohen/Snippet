import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-extrabold text-indigo-500 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold mb-2">
          Oops! Page not found.
        </h2>

        <p className="text-gray-400 mb-6">
          The page you are looking for doesn’t exist or was moved.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-indigo-500/30"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;