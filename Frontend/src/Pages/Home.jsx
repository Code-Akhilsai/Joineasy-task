import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("student");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">

      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-125 h-125 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-10 w-100 h-100 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-150 h-150 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/75 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-indigo-400 group-hover:text-white transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>

            <div>
              <span className="text-2xl font-bold bg-linear-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent tracking-tight">
                Join<span className="text-indigo-400">Eazy</span>
              </span>

              <span className="block text-[10px] font-medium tracking-widest text-indigo-400 uppercase -mt-1">
                Academic Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a
              href="#features"
              className="hover:text-indigo-400 transition-colors"
            >
              Features
            </a>

            <a
              href="#roles"
              className="hover:text-indigo-400 transition-colors"
            >
              Roles
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">

              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-300 shadow-md shadow-slate-950/50 flex items-center gap-2 group cursor-pointer"
              >
                <svg
                  className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>

                Log In
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 cursor-pointer"
              >
                Get Started
              </button>

            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle Mobile Navigation"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">

          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed top-0 right-0 w-4/5 max-w-xs h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl z-50">

            <div className="space-y-6">

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">

                  <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-indigo-500 to-purple-500 p-0.5">
                    <div className="w-full h-full bg-slate-950 rounded-md flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-indigo-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <span className="font-bold text-white text-lg">
                    JoinEazy
                  </span>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile Links */}
              <nav className="flex flex-col gap-2 text-base font-medium">

                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                >
                  Features
                </a>

                <a
                  href="#roles"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                >
                  Roles
                </a>

              </nav>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-800">

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/login");
                }}
                className="w-full py-3 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800 border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                Log In
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/register");
                }}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Get Started
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto space-y-6">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide shadow-inner">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>Next-Gen Group & Assignment Management</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Seamless Collaboration for
            <br className="hidden sm:inline" />

            <span className="bg-linear-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Students & Professors
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
            Form student teams, share OneDrive submission links, verify
            completion with two-step confirmations, and track assignment
            progress in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">

            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              Access Portal / Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-slate-300 hover:text-white bg-slate-900/90 border border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-300 cursor-pointer"
            >
              Create New Account
            </button>

          </div>

          <div className="pt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-slate-400 border-t border-slate-800/80 mt-12">

            <div>
              <span className="text-emerald-400 font-bold">✓</span>{" "}
              Two-Step Verification
            </div>

            <div>
              <span className="text-emerald-400 font-bold">✓</span>{" "}
              Direct OneDrive Links
            </div>

            <div>
              <span className="text-emerald-400 font-bold">✓</span>{" "}
              Real-Time Analytics
            </div>

            <div>
              <span className="text-emerald-400 font-bold">✓</span>{" "}
              Role-Based Control
            </div>

          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl p-1 bg-linear-to-b from-indigo-500/30 via-slate-800/20 to-slate-950/80 shadow-2xl shadow-indigo-950/50">

          <div className="bg-slate-900/90 rounded-[15px] p-6 md:p-8 backdrop-blur-xl border border-slate-800/80 space-y-6">

            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">

              <div className="flex items-center gap-3">

                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>

                <span className="text-xs font-mono text-slate-400 pl-2">
                  joineazy.app/dashboard
                </span>

              </div>

              <div className="flex items-center gap-2">

                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live Sync
                </span>

                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Student & Professor/Admin Portal
                </span>

              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Group */}
              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 space-y-3">

                <div className="flex justify-between items-start">

                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                    Group Status
                  </span>

                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-300">
                    Active
                  </span>

                </div>

                <h3 className="text-lg font-bold text-white">
                  Team Nexus
                </h3>

                <p className="text-xs text-slate-400">
                  4 Group Members Joined
                </p>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-linear-to-r from-indigo-500 to-purple-500 h-full w-full" />
                </div>

                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Group Submission</span>
                  <span className="text-emerald-400 font-bold">
                    Confirmed
                  </span>
                </div>

              </div>

              {/* Assignment */}
              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 space-y-3">

                <div className="flex justify-between items-start">

                  <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                    Assignment #3
                  </span>

                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300">
                    Due Soon
                  </span>

                </div>

                <h3 className="text-lg font-bold text-white">
                  Distributed Systems Project
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="truncate">
                    OneDrive Submission Folder
                  </span>
                </div>

                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Professor Link</span>

                  <span className="text-indigo-400 font-bold">
                    Open Folder
                  </span>
                </div>

              </div>

              {/* Admin Analytics */}
              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 space-y-3">

                <div className="flex justify-between items-start">

                  <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
                    Professor / Admin View
                  </span>

                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-300">
                    Analytics
                  </span>

                </div>

                <h3 className="text-lg font-bold text-white">
                  Submission Progress
                </h3>

                <div className="flex items-baseline gap-2">

                  <span className="text-2xl font-black text-white">
                    88%
                  </span>

                  <span className="text-xs text-emerald-400">
                    ↑ 12% today
                  </span>

                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-linear-to-r from-purple-500 to-emerald-400 h-full w-[88%]" />
                </div>

                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>22 / 25 Groups Submitted</span>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-20 bg-slate-900/50 border-y border-slate-800/80"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center max-w-2xl mx-auto space-y-4">

            <h2 className="text-3xl font-extrabold text-white">
              Designed for Seamless Academic Execution
            </h2>

            <p className="text-slate-400">
              Everything students and professors need to manage group
              deliverables efficiently.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Group Formation */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 space-y-4">

              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg">
                G
              </div>

              <h3 className="text-xl font-bold text-white">
                Group Formation
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">
                Students easily create project groups and invite teammates
                via email or student ID.
              </p>

            </div>

            {/* OneDrive Links */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 space-y-4">

              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg">
                L
              </div>

              <h3 className="text-xl font-bold text-white">
                OneDrive Links
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">
                Direct external submission links posted by professors for
                effortless file uploads.
              </p>

            </div>

            {/* Verification */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 space-y-4">

              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg">
                V
              </div>

              <h3 className="text-xl font-bold text-white">
                Two-Step Verification
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">
                Submission verification ensures clean and accurate submission
                records.
              </p>

            </div>

            {/* Analytics */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 space-y-4">

              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg">
                A
              </div>

              <h3 className="text-xl font-bold text-white">
                Professor / Admin Analytics
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">
                Comprehensive group-wise and student-wise submission tracking
                and analytics dashboard.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* Roles */}
      <section
        id="roles"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >

        <div className="bg-slate-900/80 rounded-3xl p-8 md:p-12 border border-slate-800 backdrop-blur-xl">

          <div className="text-center max-w-2xl mx-auto space-y-6">

            <h2 className="text-3xl font-extrabold text-white">
              Built for Both Student & Admin Roles
            </h2>

            <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">

              <button
                onClick={() => setActiveTab("student")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "student"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Student Role
              </button>

              <button
                onClick={() => setActiveTab("admin")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "admin"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Professor / Admin
              </button>

            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

            <div className="space-y-6">

              {activeTab === "student" ? (
                <>
                  <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase">
                    Student Features
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    Take Control of Your Team Projects
                  </h3>

                  <ul className="space-y-4 text-slate-300">
                    <li>
                      <span className="text-emerald-400 font-bold">✓</span>{" "}
                      Register and sign in to view assigned coursework.
                    </li>

                    <li>
                      <span className="text-emerald-400 font-bold">✓</span>{" "}
                      Create custom student groups and invite teammates.
                    </li>

                    <li>
                      <span className="text-emerald-400 font-bold">✓</span>{" "}
                      Access professor OneDrive submission links directly.
                    </li>

                    <li>
                      <span className="text-emerald-400 font-bold">✓</span>{" "}
                      Confirm submissions and track progress.
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase">
                    Professor / Admin Features
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    Monitor & Manage with Confidence
                  </h3>

                  <ul className="space-y-4 text-slate-300">

                    <li>
                      <span className="text-emerald-400 font-bold">✓</span>{" "}
                      Create and manage assignments.
                    </li>

                    <li>
                      <span className="text-emerald-400 font-bold">✓</span>{" "}
                      Add due dates, courses, professors and OneDrive links.
                    </li>

                    <li>
                      <span className="text-emerald-400 font-bold">✓</span>{" "}
                      Track group-wise and student-wise submissions.
                    </li>

                    <li>
                      <span className="text-emerald-400 font-bold">✓</span>{" "}
                      View completion summaries and analytics.
                    </li>

                  </ul>
                </>
              )}

              <div className="pt-4">

                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-700 transition-all cursor-pointer"
                >
                  Log in as{" "}
                  {activeTab === "student"
                    ? "Student"
                    : "Professor / Admin"}{" "}
                  →
                </button>

              </div>

            </div>

            {/* Role Preview */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">

              <div className="flex items-center justify-between border-b border-slate-800 pb-3">

                <span className="text-xs font-mono text-slate-400">
                  {activeTab === "student"
                    ? "Student Workspace"
                    : "Professor / Admin Dashboard"}
                </span>

                <span className="w-2 h-2 rounded-full bg-emerald-400" />

              </div>

              {activeTab === "student" ? (
                <div className="space-y-3 text-sm">

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">

                    <div>
                      <div className="font-semibold text-white">
                        Full Stack Assignment 1
                      </div>

                      <div className="text-xs text-slate-400">
                        Due: Aug 25, 2026
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                      Submitted
                    </span>

                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">

                    <span className="text-slate-300">
                      Group Members
                    </span>

                    <span className="text-xs text-slate-400">
                      3 Members Active
                    </span>

                  </div>

                </div>
              ) : (
                <div className="space-y-3 text-sm">

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">

                    <div className="flex justify-between font-semibold text-white">
                      <span>Total Submissions</span>

                      <span className="text-purple-400">
                        18 / 20 Groups
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full w-[90%]" />
                    </div>

                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">

                    <span className="text-slate-300">
                      Create New Assignment
                    </span>

                    <span className="px-2 py-1 bg-purple-600 text-white rounded text-xs font-semibold">
                      + New
                    </span>

                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900/80 via-slate-900 to-purple-900/80 p-8 sm:p-12 border border-indigo-500/30 text-center space-y-6">

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to streamline your assignments with JoinEazy?
          </h2>

          <p className="text-slate-300 max-w-xl mx-auto text-base">
            Log in to your account now or create a new student or professor
            account to get started.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">

            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              Log In to Portal
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3.5 rounded-xl font-bold text-slate-200 hover:text-white bg-slate-950/80 hover:bg-slate-950 border border-slate-700 transition-all cursor-pointer"
            >
              Create Account
            </button>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950 text-slate-500 text-sm">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">
              JoinEazy
            </span>

            <span>
              — Student, Group & Assignment Management System
            </span>
          </div>

          <div>
            © {new Date().getFullYear()} JoinEazy. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}