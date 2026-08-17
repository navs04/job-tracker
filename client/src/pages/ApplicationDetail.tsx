import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { ApplicationDetail as ApplicationDetailType, ApplicationInput } from "../types/application";
import { STATUS_LABELS } from "../types/application";
import { fetchApplication, updateApplication, deleteApplication } from "../api/applications";
import { formatDate } from "../lib/format";
import StatusTimeline from "../components/applications/StatusTimeline";
import Modal from "../components/ui/Modal";
import ApplicationForm from "../components/applications/ApplicationForm";

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [application, setApplication] = useState<ApplicationDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (id) loadApplication(id);
  }, [id]);

  async function loadApplication(applicationId: string) {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await fetchApplication(applicationId);
      setApplication(data);
    } catch (err: any) {
      setLoadError(err.response?.status === 404 ? "Application not found" : "Failed to load application");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEditSubmit(input: ApplicationInput) {
    if (!id) return;
    await updateApplication(id, input);
    await loadApplication(id); // refetch to get updated statusHistory too
    setIsEditOpen(false);
  }

  async function handleDelete() {
    if (!id) return;
    await deleteApplication(id);
    navigate("/applications");
  }

  if (isLoading) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  if (loadError || !application) {
    return (
      <div className="p-8">
        <p className="text-red-600 mb-4">{loadError}</p>
        <Link to="/applications" className="text-indigo-600 hover:underline">
          Back to applications
        </Link>
      </div>
    );
  }

  const infoRow = (label: string, value: string) => (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="text-sm text-gray-900 mt-0.5">{value || "—"}</dd>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/applications" className="text-sm text-indigo-600 hover:underline">
        ← Back to applications
      </Link>

      <div className="flex items-start justify-between mt-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{application.jobTitle}</h1>
          <p className="text-gray-600 mt-1">{application.company}</p>
          <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
            {STATUS_LABELS[application.status]}
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditOpen(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Role information</h2>
            <dl className="grid grid-cols-2 gap-4 bg-white border border-gray-200 rounded-lg p-4">
              {infoRow("Location", application.location || "")}
              {infoRow("Work mode", application.workMode || "")}
              {infoRow("Employment type", application.employmentType || "")}
              {infoRow("Source", application.source || "")}
              {infoRow("Salary/Stipend", application.salary || "")}
              {infoRow(
                "Job URL",
                application.jobUrl ? new URL(application.jobUrl).hostname : ""
              )}
            </dl>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Important dates</h2>
            <dl className="grid grid-cols-2 gap-4 bg-white border border-gray-200 rounded-lg p-4">
              {infoRow("Application date", formatDate(application.applicationDate))}
              {infoRow("Deadline", formatDate(application.deadline))}
            </dl>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Documents & contact</h2>
            <dl className="grid grid-cols-2 gap-4 bg-white border border-gray-200 rounded-lg p-4">
              {infoRow("Resume used", application.resumeUsed || "")}
              {infoRow("Cover letter used", application.coverLetterUsed || "")}
              {infoRow("Recruiter name", application.recruiterName || "")}
              {infoRow("Recruiter email", application.recruiterEmail || "")}
            </dl>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Notes</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
              {application.notes || <span className="text-gray-400">No notes added.</span>}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Interviews</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-500">
              {application.interviews.length === 0
                ? "No interviews scheduled yet."
                : `${application.interviews.length} interview(s) — full tracking coming in Phase 7.`}
            </div>
          </section>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Timeline</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <StatusTimeline entries={application.statusHistory} />
          </div>
        </div>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit application">
        <ApplicationForm initialData={application} onSubmit={handleEditSubmit} onCancel={() => setIsEditOpen(false)} />
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete application?">
        <p className="text-sm text-gray-600 mb-4">This will permanently delete this application and cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
            Cancel
          </button>
          <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}