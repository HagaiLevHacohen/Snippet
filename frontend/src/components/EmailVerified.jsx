import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function EmailVerified() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="font-['Montserrat',sans-serif] min-h-screen flex justify-center items-start pt-18 sm:pt-32 text-white bg-linear-to-br from-slate-950 via-indigo-950 to-black">
      <div className="bg-gray-800 border border-gray-700 rounded-md px-8 py-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-green-400">
          Email verified 🎉
        </h1>

        <p className="text-gray-300 mb-6">
          Your email has been successfully verified. You can now log in to your account.
        </p>

        <Link
          to="/login"
          className="inline-block w-full bg-purple-600 hover:bg-purple-700 rounded-md py-2 font-semibold transition"
        >
          Go to Login
        </Link>

        <p className="text-sm text-gray-500 mt-4">
          Redirecting to login...
        </p>
      </div>
    </div>
  );
}

export default EmailVerified;