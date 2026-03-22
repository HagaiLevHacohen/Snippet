import { useState } from "react";
import FormInput from "./FormInput";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signupRequest } from "../api/auth";

function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: signupRequest,
    onSuccess: () => {
      toast.success("Signup successful!");
      setForm({ username: "", email: "", name: "", password: "", confirm_password: "" });
      setErrors({});
    },
    onError: (err) => {
      if (err?.errors) {
        // API validation errors
        const apiErrors = {};
        err.errors.forEach((e) => {
          apiErrors[e.path] = e.msg;
        });
        setErrors(apiErrors);
      } else {
        toast.error(err.message || "Signup failed. Please try again.");
      }
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    const name = form.name.trim();
    const username = form.username.trim();
    const email = form.email.trim();
    const password = form.password;
    const confirmPassword = form.confirm_password;

    if (!name) newErrors.name = "Name is required";
    else if (name.length > 50) newErrors.name = "Name must be at most 50 characters";

    if (!username) newErrors.username = "Username is required";
    else if (username.length > 20) newErrors.username = "Username must be at most 20 characters";

    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    else if (!/[A-Z]/.test(password)) newErrors.password = "Password must contain an uppercase letter";
    else if (!/[a-z]/.test(password)) newErrors.password = "Password must contain a lowercase letter";
    else if (!/[0-9]/.test(password)) newErrors.password = "Password must contain a number";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) newErrors.password = "Password must contain a special character";

    if (confirmPassword !== password) newErrors.confirm_password = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      mutation.mutate(form);
    }
  };

  return (
    <div className="font-['Montserrat',sans-serif] min-h-screen flex justify-center items-start pt-18 sm:pt-32 text-white bg-linear-to-br from-slate-950 via-indigo-950 to-black">
      <Link
        to="/"
        className="absolute top-6 left-6 text-2xl hover:scale-105 text-purple-400 hover:text-purple-300 font-semibold"
      >
        ← Home
      </Link>
      <div className="bg-gray-800 border rounded-md border-gray-700 py-6 px-8 sm:px-12">
        <h1 className="text-center font-bold text-3xl mb-8">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-10">
          <FormInput
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
          <FormInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
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
          <FormInput
            label="Confirm Password"
            name="confirm_password"
            type="password"
            value={form.confirm_password}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
          <div>
            {Object.values(errors).map((error, index) => (
              <p key={index} className="text-red-500 text-sm font-bold">
                • {error}
              </p>
            ))}
          </div>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="bg-linear-to-r from-purple-600 via-purple-700 to-purple-800 hover:scale-110 rounded-lg py-2 font-semibold transition-all"
          >
            {mutation.isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-2 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-500 hover:text-purple-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;