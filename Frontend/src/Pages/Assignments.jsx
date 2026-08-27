import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../Services/api.js";
import { Link } from "react-router-dom";

const Assignments = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedCourse = searchParams.get("course");

  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [group, setGroup] = useState(null);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [stepOneChecked, setStepOneChecked] = useState(false);

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
        console.error("Failed to load assignments:", error);
      }
    };

    loadAssignmentsData();
  }, []);

  const handleConfirmSubmission = async () => {
    if (!selectedAssignment || !stepOneChecked || !group) return;

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
      return;
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

  const displayedAssignments = selectedCourse
    ? assignments.filter((item) => item.course === selectedCourse)
    : assignments;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-125 h-125 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-10 w-100 h-100 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Heading */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-slate-400 hover:text-indigo-400 transition-colors mb-3 cursor-pointer"
          >
            ← Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {selectedCourse
                  ? `${selectedCourse} Assignments`
                  : "Coursework & OneDrive Uploads"}
              </h1>

              <p className="text-slate-400 text-sm mt-1">
                Access professor OneDrive folders and verify your group
                submissions.
              </p>
            </div>

            {selectedCourse && (
              <span className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                {displayedAssignments.length} Assignment
                {displayedAssignments.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Assignments */}
        <div className="space-y-6">
          {displayedAssignments.length === 0 ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-10 text-center">
              <h2 className="text-lg font-bold text-white">
                No assignments found
              </h2>

              <p className="text-sm text-slate-400 mt-2">
                There are no assignments available for this course yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {displayedAssignments.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl space-y-4 transition-all duration-300 shadow-lg"
                >
                  {/* Assignment Header */}
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

                  {/* Description */}
                  <p className="text-sm text-slate-300">{item.description}</p>

                  {/* Assignment Details */}
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

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
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
          )}
        </div>
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

            {/* Step 1 */}
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

            {/* Step 2 */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedAssignment(null);
                  setStepOneChecked(false);
                }}
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
};

export default Assignments;
