import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { resendVerificationRequest } from "../api/auth";

function VerifyEmail() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [inputEmail, setInputEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const resendMutation = useMutation({
    mutationFn: resendVerificationRequest,
    onSuccess: () => {
      toast.success("Verification email sent!");
      setCooldown(60); // 60s cooldown
    },
    onError: (err) => {
      toast.error(err.message || "Failed to resend email");
    },
  });

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = () => {
    const targetEmail = email || inputEmail;

    if (!targetEmail) {
      toast.error("Please enter your email");
      return;
    }

    if (!email) setEmail(targetEmail);

    resendMutation.mutate({ email: targetEmail });
  };

  return (
    <div className="font-['Montserrat',sans-serif] min-h-screen flex justify-center items-start pt-18 sm:pt-32 text-white bg-linear-to-br from-slate-950 via-indigo-950 to-black">
      <div className="bg-gray-800 border border-gray-700 rounded-md px-8 py-10 max-w-md w-full text-center">
        
        <h1 className="text-3xl font-bold mb-6">Verify your email</h1>

        {email ? (
          <>
            <p className="mb-4">
              We sent a verification link to:
            </p>
            <p className="font-semibold text-purple-400 mb-6 break-all">
              {email}
            </p>
          </>
        ) : (
          <>
            <p className="mb-4">
              Enter your email to receive a verification link:
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 mb-4 outline-none"
            />
          </>
        )}

        <p className="text-sm text-gray-400 mb-6">
          Didn't get the email? Check your spam folder or resend it.
        </p>

        <button
          onClick={handleResend}
          disabled={cooldown > 0 || resendMutation.isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-md py-2 font-semibold transition"
        >
          {resendMutation.isLoading
            ? "Sending..."
            : cooldown > 0
            ? `Resend in ${cooldown}s`
            : "Resend verification email"}
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;