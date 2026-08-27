import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../Services/api.js";

const Assignments = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCourse = searchParams.get("course");

  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [group, setGroup] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [stepOneChecked, setStepOneChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadAssignmentsData = async () => {
      try {
        const [assignmentsResponse, submissionsResponse, groupResponse] =
          await Promise.all([
            api.get("/assignments/all", { withCredentials: true }),
            api.get("/submissions/my-submissions", {
              withCredentials: true,
            }),
            api.get("/groups/my-group", { withCredentials: true }),
          ]);

        const submissionData = submissionsResponse.data.submissions || [];
        const assignmentData = assignmentsResponse.data.assignments || [];

        setSubmissions(submissionData);
        setGroup(groupResponse.data.group || null);

        const formattedAssignments = assignmentData.map((assignment) => {
          const submission = submissionData.find(
            (s) => Number(s.assignment_id) === Number(assignment.id),
          );

          return {
            id: assignment.id,
            title: assignment.title,
            course: assignment.course,
            professor: assignment.professor,
            dueDate: assignment.due_date
              ? new Date(assignment.due_date).toLocaleString()
              : "Not specified",
            oneDriveUrl: assignment.onedrive_link,
            description: assignment.description,
            submissionType:
              assignment.submission_type ||
              assignment.submissionType ||
              "Group",
            status: submission ? "submitted" : "pending",
            submittedAt: submission?.confirmed_at
              ? new Date(submission.confirmed_at).toLocaleString()
              : null,
          };
        });

        setAssignments(formattedAssignments);
      } catch (error) {
        console.error("Failed to load assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAssignmentsData();
  }, []);

  const currentMember = group?.members?.find(
    (member) =>
      Number(member.id) === Number(group?.student_id) ||
      Number(member.student_id) === Number(group?.student_id),
  );

  const isGroupLeader =
    currentMember?.role === "leader" ||
    currentMember?.role === "Leader" ||
    currentMember?.is_leader === true ||
    group?.leader_id === group?.student_id;

  const handleConfirmSubmission = async () => {
    if (!selectedAssignment || !stepOneChecked || !group || submitting) {
      return;
    }

    setSubmitting(true);

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

      const submittedAt = new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      setAssignments((prev) =>
        prev.map((item) =>
          item.id === selectedAssignment.id
            ? {
                ...item,
                status: "submitted",
                submittedAt,
              }
            : item,
        ),
      );

      setSubmissions((prev) => [
        ...prev,
        {
          assignment_id: selectedAssignment.id,
          group_id: group.id,
          confirmed_at: new Date().toISOString(),
        },
      ]);

      setSelectedAssignment(null);
      setStepOneChecked(false);
    } catch (error) {
      console.error("Failed to confirm submission:", error);

      alert(
        error.response?.data?.message ||
          "Failed to confirm submission. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const displayedAssignments = selectedCourse
    ? assignments.filter((item) => item.course === selectedCourse)
    : assignments;

  const completedCount = displayedAssignments.filter(
    (item) => item.status === "submitted",
  ).length;

  const progress =
    displayedAssignments.length > 0
      ? Math.round((completedCount / displayedAssignments.length) * 100)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-125 h-125 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-100 h-100 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

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
              Assignments
            </span>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-slate-400 hover:text-indigo-400 transition-colors mb-3 cursor-pointer"
          >
            ← Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {selectedCourse
                  ? `${selectedCourse} Assignments`
                  : "Coursework & OneDrive Uploads"}
              </h1>

              <p className="text-slate-400 text-sm mt-2">
                Access assignment details, upload your work, and confirm
                submissions.
              </p>
            </div>

            <div className="w-full md:w-72 bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-400 font-medium">
                  Submission Progress
                </span>

                <span className="text-emerald-400 font-bold">{progress}%</span>
              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between mt-2 text-[11px] text-slate-500">
                <span>{completedCount} Submitted</span>
                <span>
                  {displayedAssignments.length - completedCount} Pending
                </span>
              </div>
            </div>
          </div>
        </div>

        {displayedAssignments.length === 0 ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-10 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            <h2 className="text-lg font-bold text-white">
              No assignments found
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              There are no assignments available for this course yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {displayedAssignments.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/30 rounded-2xl p-6 space-y-5 shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                      {item.course}
                    </span>

                    <h2 className="text-xl font-bold text-white mt-1">
                      {item.title}
                    </h2>
                  </div>

                  {item.status === "submitted" ? (
                    <span className="self-start lg:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      ✓ Acknowledged
                    </span>
                  ) : (
                    <span className="self-start lg:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      Pending Acknowledgment
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-300 leading-6">
                  {item.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Professor
                    </span>
                    <span className="block text-sm text-slate-200 font-semibold mt-1">
                      {item.professor}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Deadline
                    </span>
                    <span className="block text-sm text-slate-200 font-semibold mt-1">
                      {item.dueDate}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Submission Type
                    </span>
                    <span className="block text-sm text-slate-200 font-semibold mt-1">
                      {item.submissionType}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-400 font-medium">
                      Assignment Status
                    </span>

                    <span
                      className={
                        item.status === "submitted"
                          ? "text-emerald-400 font-semibold"
                          : "text-amber-400 font-semibold"
                      }
                    >
                      {item.status === "submitted"
                        ? "100% Complete"
                        : "50% Complete"}
                    </span>
                  </div>

                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${
                        item.status === "submitted"
                          ? "w-full bg-emerald-500"
                          : "w-1/2 bg-indigo-500"
                      }`}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2">
                    {item.status === "submitted"
                      ? `Acknowledged on ${item.submittedAt}`
                      : "Upload your work and acknowledge the submission."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <a
                    href={item.oneDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                    </svg>
                    Open OneDrive Submission Folder ↗
                  </a>

                  {item.status === "pending" ? (
                    item.submissionType.toLowerCase() === "individual" ||
                    isGroupLeader ? (
                      <button
                        onClick={() => {
                          setSelectedAssignment(item);
                          setStepOneChecked(false);
                        }}
                        className="flex-1 px-5 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Confirm Submission
                      </button>
                    ) : (
                      <div className="flex-1 px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 text-xs font-semibold flex items-center justify-center text-center">
                        Only the group leader can acknowledge
                      </div>
                    )
                  ) : (
                    <div className="flex-1 px-5 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center justify-center">
                      ✓ Submission acknowledged for the group
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => {
              if (!submitting) {
                setSelectedAssignment(null);
                setStepOneChecked(false);
              }
            }}
          />

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

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-300">
                Step 1: External OneDrive Upload Confirmation
              </div>

              <p className="text-xs text-slate-400 leading-5">
                Please ensure your group's files have been uploaded to the
                OneDrive folder provided by {selectedAssignment.professor}.
              </p>

              <a
                href={selectedAssignment.oneDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline"
              >
                Verify OneDrive Folder URL ↗
              </a>

              <label className="flex items-center gap-3 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stepOneChecked}
                  onChange={(e) => setStepOneChecked(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />

                <span className="text-xs font-medium text-slate-200">
                  Yes, I have submitted our files to the OneDrive folder.
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setSelectedAssignment(null);
                  setStepOneChecked(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!stepOneChecked || submitting}
                onClick={handleConfirmSubmission}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all ${
                  stepOneChecked && !submitting
                    ? "bg-linear-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 shadow-lg shadow-emerald-600/30 cursor-pointer"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {submitting ? "Confirming..." : "Confirm & Finalize Submission"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
