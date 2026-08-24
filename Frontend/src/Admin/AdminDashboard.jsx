import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../Services/api.js";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", blockBack);
    return () => window.removeEventListener("popstate", blockBack);
  }, []);

 

  const [activeTab, setActiveTab] = useState("submissions");
  const [submissions, setSubmissions] = useState([]);
  const [groups, setGroups] = useState([]);

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    course: "",
    professor: "",
    dueDate: "",
    oneDriveUrl: "",
    description: "",
  });

  const [postSuccessMsg, setPostSuccessMsg] = useState("");

  // Fetch admin profile and data on mount
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await api.get("/users/profile", {
          withCredentials: true,
        });
        if (response.data.user) {
          setAdmin(response.data.user);
        }
      } catch (error) {
        console.warn("Using default admin profile demo state:", error.message);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await api.get("/groups/all", {
          withCredentials: true,
        });

        const formattedGroups = response.data.groups.map((group) => ({
          id: group.id,
          name: group.name,
          code: group.code,
          leader: group.leader,
          membersCount: Number(group.members_count),
          createdDate: new Date(group.created_at).toLocaleDateString(),
        }));

        setGroups(formattedGroups);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };

    const fetchSubmissions = async () => {
      try {
        const response = await api.get("/submissions/all", {
          withCredentials: true,
        });

        const formatted = response.data.submissions.map((sub) => ({
          ...sub,
          confirmedAt: new Date(sub.confirmedAt).toLocaleString(),
          status: "Confirmed",
        }));

        setSubmissions(formatted);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      }
    };

    fetchSubmissions();

    fetchGroups();

    fetchAdminProfile();
  }, []);

  // Post New Assignment Handler
  const handlePostAssignment = async (e) => {
    e.preventDefault();

    if (
      !newAssignment.title.trim() ||
      !newAssignment.course.trim() ||
      !newAssignment.dueDate.trim() ||
      !newAssignment.oneDriveUrl.trim() ||
      !newAssignment.description.trim()
    ) {
      return;
    }

    try {
      await api.post(
        "/assignments/create",
        {
          title: newAssignment.title,
          course: newAssignment.course,
          professor: newAssignment.professor,
          description: newAssignment.description,
          dueDate: newAssignment.dueDate,
          oneDriveUrl: newAssignment.oneDriveUrl,
        },
        {
          withCredentials: true,
        },
      );

      setPostSuccessMsg(
        `Successfully published assignment: "${newAssignment.title}"!`,
      );

      setNewAssignment({
        title: "",
        course: "",
        professor: "",
        dueDate: "",
        oneDriveUrl: "",
        description: "",
      });

      setTimeout(() => setPostSuccessMsg(""), 4000);
    } catch (error) {
      console.error("Failed to create assignment:", error);

      alert(error.response?.data?.message || "Failed to create assignment");
    }
  };

  // Stats Calculations
  const totalSubmissionsCount = submissions.length;
  const totalGroupsCount = groups.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-125 h-125 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-10 w-100 h-100 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
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
              <span className="font-bold text-white text-lg">JoinEazy</span>
            </Link>
            <span className="hidden sm:inline text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Faculty Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-200">
                {admin.name}
              </span>
              <span className="text-[11px] text-slate-400">{admin.email}</span>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("user");
                navigate("/", { replace: true });
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg
                className="w-3.5 h-3.5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">
              Faculty Dashboard Overview
            </h1>
            <p className="text-slate-400 text-sm">
              Review student submissions, manage project groups, and publish
              coursework OneDrive folders.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-center flex-1 md:flex-initial">
              <span className="block text-[11px] text-slate-400 uppercase font-semibold">
                Submissions
              </span>
              <span className="text-2xl font-bold text-emerald-400">
                {totalSubmissionsCount}
              </span>
            </div>
            <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-center flex-1 md:flex-initial">
              <span className="block text-[11px] text-slate-400 uppercase font-semibold">
                Active Groups
              </span>
              <span className="text-2xl font-bold text-indigo-400">
                {totalGroupsCount}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "submissions"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Student Submissions ({submissions.length})
          </button>

          <button
            onClick={() => setActiveTab("groups")}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "groups"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Student Groups ({groups.length})
          </button>

          <button
            onClick={() => setActiveTab("create")}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "create"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Post New Assignment
          </button>
        </div>

        {/* TAB 1: SUBMISSIONS OVERVIEW TABLE */}
        {activeTab === "submissions" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Confirmed Submissions
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Log of all verified coursework submissions submitted by
                  student teams.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Assignment</th>
                      <th className="p-3">Course</th>
                      <th className="p-3">Group Name</th>
                      <th className="p-3">Confirmed By</th>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3">OneDrive Link</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {submissions.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="p-6 text-center text-slate-500"
                        >
                          No submissions recorded yet.
                        </td>
                      </tr>
                    ) : (
                      submissions.map((sub) => (
                        <tr
                          key={sub.id}
                          className="hover:bg-slate-950/40 transition-colors"
                        >
                          <td className="p-3 font-semibold text-white">
                            {sub.assignmentTitle}
                          </td>
                          <td className="p-3 text-indigo-400 font-medium">
                            {sub.course}
                          </td>
                          <td className="p-3 font-mono text-slate-300">
                            {sub.groupName}
                          </td>
                          <td className="p-3">
                            <div className="font-medium text-slate-200">
                              {sub.studentName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {sub.studentEmail}
                            </div>
                          </td>
                          <td className="p-3 font-mono text-slate-400">
                            {sub.confirmedAt}
                          </td>
                          <td className="p-3">
                            <a
                              href={sub.oneDriveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline flex items-center gap-1 font-medium"
                            >
                              <span>View Files</span>
                              <span>↗</span>
                            </a>
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 text-[11px]">
                              ✓ Confirmed
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GROUPS ROSTER TABLE */}
        {activeTab === "groups" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                Registered Student Groups
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Overview of active student project groups and leaders.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Group Name</th>
                      <th className="p-3">Group Code</th>
                      <th className="p-3">Team Leader</th>
                      <th className="p-3">Members Count</th>
                      <th className="p-3">Created Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {groups.map((grp) => (
                      <tr
                        key={grp.id}
                        className="hover:bg-slate-950/40 transition-colors"
                      >
                        <td className="p-3 font-semibold text-white">
                          {grp.name}
                        </td>
                        <td className="p-3 font-mono text-indigo-400 font-bold">
                          {grp.code}
                        </td>
                        <td className="p-3 text-slate-200">{grp.leader}</td>
                        <td className="p-3 font-mono text-slate-400">
                          {grp.membersCount} Members
                        </td>
                        <td className="p-3 font-mono text-slate-400">
                          {grp.createdDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: POST ASSIGNMENT FORM */}
        {activeTab === "create" && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                Post New Course Assignment
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Publish a new assignment for students with a designated OneDrive
                submission folder.
              </p>
            </div>

            <form onSubmit={handlePostAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Distributed Database Architecture"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Course Code & Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newAssignment.course}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        course: e.target.value,
                      })
                    }
                    placeholder="e.g. CS-405 Database Systems"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Professor
                  </label>

                  <input
                    type="text"
                    required
                    value={newAssignment.professor}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        professor: e.target.value,
                      })
                    }
                    placeholder="e.g. Dr. Robert Vance"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Due Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newAssignment.dueDate}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        dueDate: e.target.value,
                      })
                    }
                    placeholder="e.g. Aug 28, 2026 - 05:00 PM"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  OneDrive Submission Folder URL
                </label>
                <input
                  type="url"
                  required
                  value={newAssignment.oneDriveUrl}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      oneDriveUrl: e.target.value,
                    })
                  }
                  placeholder="https://onedrive.live.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assignment Description / Instructions
                </label>
                <textarea
                  rows="3"
                  required
                  value={newAssignment.description}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      description: e.target.value,
                    })
                  }
                  placeholder="Provide details on project submission requirements..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                />
              </div>

              {postSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
                  ✓ {postSuccessMsg}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
