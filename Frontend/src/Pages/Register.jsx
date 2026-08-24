import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../Services/api.js";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role: role === "professor" ? "admin" : "student",
      });

      if (response.status !== 201) {
        return alert("User failed to register");
      }

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/3 w-100 h-100 bg-purple-600/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 p-8 rounded-2xl backdrop-blur-xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-block text-2xl font-bold text-white tracking-tight"
          >
            Join<span className="text-indigo-400">Eazy</span>
          </Link>

          <h2 className="text-xl font-semibold text-slate-200">
            Create New Account
          </h2>

          <p className="text-xs text-slate-400">
            Join JoinEazy as a Student or Professor
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              role === "student"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Student Account
          </button>

          <button
            type="button"
            onClick={() => setRole("professor")}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              role === "professor"
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Professor Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Full Name
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                role === "student"
                  ? "student@university.edu"
                  : "professor@university.edu"
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-16 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none transition-colors"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Register */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            Register as {role === "student" ? "Student" : "Professor"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 font-semibold hover:underline"
          >
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}