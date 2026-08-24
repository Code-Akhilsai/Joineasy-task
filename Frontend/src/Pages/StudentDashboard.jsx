import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../Services/api.js";

export default function StudentDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", blockBack);
    () => window.removeEventListener("popstate", blockBack);

    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile", {
          withCredentials: true,
        });

        setStudent(response.data.user);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);
  const [student, setStudent] = useState({});
  const [group, setGroup] = useState(null);
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [assignmentsResponse, submissionsResponse, groupResponse] =
          await Promise.all([
            api.get("/assignments/all", { withCredentials: true }),
            api.get("/submissions/my-submissions", { withCredentials: true }),
            api.get("/groups/my-group", { withCredentials: true }),
          ]);

        const submissionData = submissionsResponse.data.submissions;

        setSubmissions(submissionData);
        setGroup(groupResponse.data.group);

        const formattedAssignments = assignmentsResponse.data.assignments.map(
          (assignment) => {
            const submission = submissionData.find(
              (s) => Number(s.assignment_id) === Number(assignment.id),
            );

            return {
              id: assignment.id,
              title: assignment.title,
              course: assignment.course,
              professor: assignment.professor,
              dueDate: new Date(assignment.due_date).toLocaleString(),
              oneDriveUrl: assignment.onedrive_link,
              description: assignment.description,
              status: submission ? "submitted" : "pending",
              submittedAt: submission
                ? new Date(submission.confirmed_at).toLocaleString()
                : null,
            };
          },
        );

        setAssignments(formattedAssignments);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    loadDashboardData();
  }, []);

  const [newGroupName, setNewGroupName] = useState("");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [stepOneChecked, setStepOneChecked] = useState(false);
  const [activeTab, setActiveTab] = useState("assignments");

  const handleInviteMember = async (e) => {
    e.preventDefault();

    if (!inviteInput.trim() || !group) return;

    try {
      await api.post(
        "/groups/add-member",
        {
          groupId: group.id,
          email: inviteInput,
        },
        {
          withCredentials: true,
        },
      );

      const response = await api.get("/groups/my-group", {
        withCredentials: true,
      });

      setGroup(response.data.group);

      setInviteSuccessMsg(`Added ${inviteInput} to ${group.name}!`);
      setInviteInput("");

      setTimeout(() => setInviteSuccessMsg(""), 4000);
    } catch (error) {
      console.error("Failed to add member:", error);

      alert(error.response?.data?.message || "Failed to add member");
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!newGroupName.trim()) return;

    try {
      const code = `CODE-${Math.floor(1000 + Math.random() * 9000)}`;

      const response = await api.post(
        "/groups/create",
        {
          name: newGroupName,
          code,
        },
        {
          withCredentials: true,
        },
      );

      const groupResponse = await api.get("/groups/my-group", {
        withCredentials: true,
      });

      setGroup(groupResponse.data.group);

      setIsCreatingGroup(false);
      setNewGroupName("");
    } catch (error) {
      console.error("Failed to create group:", error);

      alert(error.response?.data?.message || "Failed to create group");
    }
  };

  const handleConfirmSubmission = async () => {
    if (!selectedAssignment || !stepOneChecked) return;

    try {
      await api.post(
        "submissions/confirm",
        {
          assignmentId: selectedAssignment.id,
          groupId: group.id,
        },
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error("Failed to insert into submissions database table:", error);
    }

    setAssignments((prev) =>
      prev.map((item) =>
        item.id === selectedAssignment.id
          ? {
              ...item,
              status: "submitted",
              submittedAt: new Date().toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : item,
      ),
    );

    setSelectedAssignment(null);
    setStepOneChecked(false);
  };

  const totalAssignments = assignments.length;
  const completedAssignments = submissions.length;
  const progressPercentage = Math.round(
    (completedAssignments / totalAssignments) * 100,
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Background Glows */}
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
            <span className="hidden sm:inline text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Student Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-200">
                {student.name}
              </span>
              <span className="text-[11px] text-slate-400">
                {student.email}
                {student.id ? ` • ID: #${student.id}` : ""}
              </span>
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

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Overview / Group Badge */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {student.name}! 👋
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {group ? group.name : "No Group Assigned"}
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Manage your student group, access OneDrive submission links, and
              confirm assignment completions.
            </p>
          </div>

          {/* Quick Progress Bar Summary */}
          <div className="w-full md:w-72 bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">
                Overall Completion
              </span>
              <span className="text-emerald-400 font-bold">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>
                {completedAssignments} of {totalAssignments} Submitted
              </span>
              <span className="text-indigo-400 font-semibold">
                {totalAssignments - completedAssignments} Pending
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Nav Tabs */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "assignments"
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Assignments ({assignments.length})
          </button>

          <button
            onClick={() => setActiveTab("group")}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "group"
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
            My Group ({group ? group.members.length : 0})
          </button>

          <button
            onClick={() => setActiveTab("progress")}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "progress"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Progress & Badges
          </button>
        </div>

        {/* TAB 1: ASSIGNMENTS & ONEDRIVE LINKS */}
        {activeTab === "assignments" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Coursework & OneDrive Uploads
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Access professor OneDrive folders and verify your group
                  submissions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {assignments.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl space-y-4 transition-all duration-300 shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        {item.course}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        {item.title}
                      </h3>
                    </div>

                    <div>
                      {item.status === "submitted" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Confirmed Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          Pending Submission
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-300">{item.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="block text-slate-500 font-medium">
                        Professor / Instructor
                      </span>
                      <span className="text-slate-200 font-semibold">
                        {item.professor}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-500 font-medium">
                        Due Date & Time
                      </span>
                      <span className="text-slate-200 font-semibold">
                        {item.dueDate}
                      </span>
                    </div>
                  </div>

                  {/* Actions Row: OneDrive Link & Confirm Button */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                    {/* OneDrive Submission Link */}
                    <a
                      href={item.oneDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                      </svg>
                      Open OneDrive Submission Folder ↗
                    </a>

                    {/* Two-Step Verification Button */}
                    {item.status === "pending" ? (
                      <button
                        onClick={() => {
                          setSelectedAssignment(item);
                          setStepOneChecked(false);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
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
                        Confirm Submission (Step 1 of 2)
                      </button>
                    ) : (
                      <div className="text-right text-xs text-slate-400">
                        Submitted on{" "}
                        <span className="text-slate-200 font-semibold">
                          {item.submittedAt}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MY GROUP & MEMBER MANAGEMENT */}
        {activeTab === "group" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Student Group Management
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Create project teams and invite fellow students via email or
                  student ID.
                </p>
              </div>

              {!isCreatingGroup && (
                <button
                  onClick={() => setIsCreatingGroup(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer self-start"
                >
                  <span>+ Create New Group</span>
                </button>
              )}
            </div>

            {/* Modal/Form to Create Group */}
            {isCreatingGroup && (
              <form
                onSubmit={handleCreateGroup}
                className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4"
              >
                <h3 className="text-md font-bold text-white">
                  Create a New Student Group
                </h3>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g. Team ByteCrafters"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingGroup(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    Save Group
                  </button>
                </div>
              </form>
            )}

            {/* Active Group Details */}
            {group ? (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono text-indigo-400">
                      GROUP CODE: {group.code}
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      {group.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Created by {group.creator}
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    <span className="text-slate-400">Total Teammates:</span>{" "}
                    <span className="text-indigo-400 font-bold">
                      {group.members.length} Members
                    </span>
                  </div>
                </div>

                {/* Invite Member Form */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Invite Member via Email or Student ID
                  </h4>

                  <form
                    onSubmit={handleInviteMember}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <input
                      type="text"
                      required
                      value={inviteInput}
                      onChange={(e) => setInviteInput(e.target.value)}
                      placeholder="Enter student email (student@uni.edu) or ID (STU-2026-XXXX)"
                      className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      + Add Member
                    </button>
                  </form>

                  {inviteSuccessMsg && (
                    <div className="text-xs text-emerald-400 font-medium pt-1">
                      ✓ {inviteSuccessMsg}
                    </div>
                  )}
                </div>

                {/* Members List Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Group Roster
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-3">Student Name</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Student ID</th>
                          <th className="p-3">Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {group.members.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-950/40">
                            <td className="p-3 font-semibold text-white">
                              {m.name}
                            </td>
                            <td className="p-3 font-mono text-slate-400">
                              {m.email}
                            </td>
                            <td className="p-3 font-mono text-slate-400">
                              {m.id || m.studentId}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  m.role === "leader"
                                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                    : "bg-slate-800 text-slate-300"
                                }`}
                              >
                                {m.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-4">
                <p className="text-slate-400 text-sm">
                  You are not part of any group yet.
                </p>
                <button
                  onClick={() => setIsCreatingGroup(true)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
                >
                  Create Group Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VISUAL PROGRESS TRACKER */}
        {activeTab === "progress" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                Visual Progress & Submissions Status
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Track completion badges and overall coursework milestones.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                <span className="text-xs font-semibold text-slate-400">
                  Total Coursework
                </span>
                <div className="text-3xl font-black text-white">
                  {totalAssignments}
                </div>
                <p className="text-xs text-slate-400">
                  Assignments posted by professors
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                <span className="text-xs font-semibold text-emerald-400">
                  Confirmed Submissions
                </span>
                <div className="text-3xl font-black text-emerald-400">
                  {completedAssignments}
                </div>
                <p className="text-xs text-slate-400">
                  Two-step verification completed
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                <span className="text-xs font-semibold text-indigo-400">
                  Completion Status Badge
                </span>
                <div className="inline-block px-3 py-1 ml-2 rounded-full text-sm font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {progressPercentage >= 100
                    ? "🎉 All Complete"
                    : "⚡ In Progress"}
                </div>
                <p className="text-xs text-slate-400">
                  {progressPercentage}% overall group completion rate
                </p>
              </div>
            </div>

            {/* Timeline Breakdown */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-md font-bold text-white">
                Submission History
              </h3>
              <div className="space-y-3">
                {assignments.map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{a.title}</div>
                      <div className="text-slate-400">{a.course}</div>
                    </div>
                    {a.status === "submitted" ? (
                      <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                        Submitted ({a.submittedAt})
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
                        Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* TWO-STEP VERIFICATION MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setSelectedAssignment(null)}
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Two-Step Submission Verification
              </span>
              <h3 className="text-xl font-bold text-white">
                {selectedAssignment.title}
              </h3>
              <p className="text-xs text-slate-400">
                Course: {selectedAssignment.course}
              </p>
            </div>

            {/* Step 1 Checkbox */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-300">
                Step 1: External OneDrive Upload Confirmation
              </div>
              <p className="text-xs text-slate-400">
                Please ensure your group's files have been uploaded to the
                OneDrive folder provided by {selectedAssignment.professor}:
              </p>

              <a
                href={selectedAssignment.oneDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline"
              >
                <span>Verify OneDrive Folder URL</span>
                <span>↗</span>
              </a>

              <label className="flex items-center gap-3 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stepOneChecked}
                  onChange={(e) => setStepOneChecked(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-medium text-slate-200">
                  "Yes, I have submitted our files to the OneDrive folder."
                </span>
              </label>
            </div>

            {/* Step 2 Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!stepOneChecked}
                onClick={handleConfirmSubmission}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                  stepOneChecked
                    ? "bg-linear-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 shadow-lg shadow-emerald-600/30"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                Confirm & Finalize Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
