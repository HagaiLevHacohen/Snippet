import { useNavigate } from "react-router";

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>404</h1>
      <h2>Oops! Page not found.</h2>
      <p>The page you are looking for doesn't exist.</p>

      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );
}

export default ErrorPage;