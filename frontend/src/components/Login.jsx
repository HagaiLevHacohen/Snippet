import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import FormInput from "./FormInput";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {loginRequest} from "../api/auth";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: async (data) => {
      // backend responses are { success, message, data }
      const token = data?.data; // extract token from response shape
      await login(token); // update auth context with actual token
      toast.success("Logged in!");
      navigate("/feed", { replace: true });
    },
    onError: (err) => {
      toast.error(err.message || "Login failed. Please try again.");
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form); // triggers the mutation
  };

  return (
    <div className="font-['Montserrat',sans-serif] min-h-screen flex justify-center items-start pt-32 text-white bg-linear-to-br from-slate-950 via-indigo-950 to-black">
      <Link
        to="/"
        className="absolute top-6 left-6 text-2xl hover:scale-105 text-purple-400 hover:text-purple-300 font-semibold"
      >
        ← Home
      </Link>
      <div className="bg-gray-800 border rounded-md border-gray-700 py-6 px-8 sm:px-12">
        <h1 className="text-center font-bold text-3xl mb-8">Log In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 sm:gap-10">
          <FormInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="bg-linear-to-r from-purple-600 via-purple-700 to-purple-800 hover:scale-110 rounded-lg py-2 font-semibold transition-all"
          >
            {mutation.isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="mt-2 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-500 hover:text-purple-400">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;