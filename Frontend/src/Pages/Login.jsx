import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../Services/api.js";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const user = response.data.user;

      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "student") {
        navigate("/student", { replace: true });
      } else {
        navigate("/admin", { replace: true });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-100 h-100 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 p-8 rounded-2xl backdrop-blur-xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-block text-2xl font-bold text-white tracking-tight"
          >
            Join<span className="text-indigo-400">Eazy</span>
          </Link>

          <h2 className="text-xl font-semibold text-slate-200">Welcome Back</h2>

          <p className="text-xs text-slate-400">
            Sign in to access your dashboard
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
            Student Login
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
            Professor Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Login */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            Sign In as {role === "student" ? "Student" : "Professor"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 font-semibold hover:underline"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
