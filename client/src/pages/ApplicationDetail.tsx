import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2, ExternalLink, Plus } from "lucide-react";
import type { ApplicationDetail as ApplicationDetailType, ApplicationInput, Interview } from "../types/application";
import { fetchApplication, updateApplication, deleteApplication } from "../api/applications";
import { createInterview, updateInterview, deleteInterview, type InterviewInput } from "../api/interviews";
import { formatDate } from "../lib/format";
import { notify } from "../lib/toast";
import StatusTimeline from "../components/applications/StatusTimeline";
import InterviewList from "../components/interviews/InterviewList";
import InterviewForm from "../components/interviews/InterviewForm";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import LoadingState from "../components/ui/LoadingState";
import ApplicationForm from "../components/applications/ApplicationForm";

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [application, setApplication] = useState<ApplicationDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInterviewFormOpen, setIsInterviewFormOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);

  useEffect(() => {
    if (id) loadApplication(id);
  }, [id]);

  async function loadApplication(applicationId: string) {
    setIsLoading(true);
    setLoadError(null);
    try {
      setApplication(await fetchApplication(applicationId));
    } catch (err: any) {
      setLoadError(err.response?.status === 404 ? "Application not found" : "Failed to load application");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEditSubmit(input: ApplicationInput) {
    if (!id) return;
    try {
      await updateApplication(id, input);
      await loadApplication(id);
      setIsEditOpen(false);
      notify.success("Application updated");
    } catch {
      notify.error("Failed to update application");
    }
  }

  async function handleDelete() {
    if (!id) return;
    try {
      await deleteApplication(id);
      notify.success("Application deleted");
      navigate("/applications");
    } catch {
      notify.error("Failed to delete application");
    }
  }

  function openCreateInterview() {
    setEditingInterview(null);
    setIsInterviewFormOpen(true);
  }

  function openEditInterview(interview: Interview) {
    setEditingInterview(interview);
    setIsInterviewFormOpen(true);
  }

  async function handleInterviewSubmit(input: InterviewInput) {
    if (!id) return;
    try {
      if (editingInterview) {
        await updateInterview(editingInterview.id, input);
        notify.success("Interview updated");
      } else {
        await createInterview(id, input);
        notify.success("Interview added");
      }
      await loadApplication(id);
      setIsInterviewFormOpen(false);
    } catch (err: any) {
      notify.error(err.response?.data?.error || "Failed to save interview");
    }
  }

  async function handleInterviewDelete(interviewId: string) {
    if (!id) return;
    try {
      await deleteInterview(interviewId);
      await loadApplication(id);
      notify.success("Interview deleted");
    } catch {
      notify.error("Failed to delete interview");
    }
  }

  if (isLoading) return <LoadingState label="Loading application..." />;

  if (loadError || !application) {
    return (
      <div className="p-8 text-center">
        <p className="text-danger text-sm mb-3">{loadError}</p>
        <Link to="/applications" className="text-sm text-accent hover:underline font-medium">
          ← Back to applications
        </Link>
      </div>
    );
  }

  const infoField = (label: string, value: string) => (
    <div>
      <dt className="text-xs font-medium text-faint uppercase tracking-wide">{label}</dt>
      <dd className="text-sm text-ink mt-0.5">{value || <span className="text-faint">—</span>}</dd>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <Link to="/applications" className="text-sm text-muted hover:text-ink transition-colors duration-150">
        ← Back to applications
      </Link>

      <div className="flex items-start justify-between mt-4 mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-accent-bg flex items-center justify-center text-base font-semibold text-accent shrink-0">
            {application.company[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-ink">{application.jobTitle}</h1>
            <p className="text-sm text-muted">{application.company}</p>
          </div>
          <Badge status={application.status} />
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="secondary" onClick={() => setIsEditOpen(true)} className="flex items-center gap-1.5">
            <Pencil size={14} strokeWidth={2} />
            Edit
          </Button>
          <Button variant="danger" onClick={() => setIsDeleteOpen(true)} className="flex items-center gap-1.5">
            <Trash2 size={14} strokeWidth={2} />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <section className="bg-surface border border-border rounded-lg p-5">
            <h2 className="text-sm font-semibold text-ink mb-4">Role information</h2>
            <dl className="grid grid-cols-2 gap-4">
              {infoField("Location", application.location || "")}
              {infoField("Work mode", application.workMode || "")}
              {infoField("Employment type", application.employmentType || "")}
              {infoField("Source", application.source || "")}
              {infoField("Salary/Stipend", application.salary || "")}
              <div>
                <dt className="text-xs font-medium text-faint uppercase tracking-wide">Job URL</dt>
                <dd className="text-sm mt-0.5">
                  {application.jobUrl ? (
                    <a
                      href={application.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline inline-flex items-center gap-1"
                    >
                      {new URL(application.jobUrl).hostname}
                      <ExternalLink size={12} strokeWidth={2} />
                    </a>
                  ) : (
                    <span className="text-faint">—</span>
                  )}
                </dd>
              </div>
            </dl>
          </section>

          <section className="bg-surface border border-border rounded-lg p-5">
            <h2 className="text-sm font-semibold text-ink mb-4">Important dates</h2>
            <dl className="grid grid-cols-2 gap-4">
              {infoField("Application date", formatDate(application.applicationDate))}
              {infoField("Deadline", formatDate(application.deadline))}
            </dl>
          </section>

          <section className="bg-surface border border-border rounded-lg p-5">
            <h2 className="text-sm font-semibold text-ink mb-4">Documents & contact</h2>
            <dl className="grid grid-cols-2 gap-4">
              {infoField("Resume used", application.resumeUsed || "")}
              {infoField("Cover letter used", application.coverLetterUsed || "")}
              {infoField("Recruiter name", application.recruiterName || "")}
              {infoField("Recruiter email", application.recruiterEmail || "")}
            </dl>
          </section>

          <section className="bg-surface border border-border rounded-lg p-5">
            <h2 className="text-sm font-semibold text-ink mb-3">Notes</h2>
            <div className="text-sm text-ink/80 whitespace-pre-wrap leading-relaxed">
              {application.notes || <span className="text-faint">No notes added.</span>}
            </div>
          </section>

          <section className="bg-surface border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-ink">Interviews</h2>
              <button
                onClick={openCreateInterview}
                className="flex items-center gap-1 text-xs text-accent hover:underline font-medium"
              >
                <Plus size={13} strokeWidth={2.5} />
                Add interview
              </button>
            </div>
            <InterviewList interviews={application.interviews} onEdit={openEditInterview} onDelete={handleInterviewDelete} />
          </section>
        </div>

        <div>
          <section className="bg-surface border border-border rounded-lg p-5 lg:sticky lg:top-6">
            <h2 className="text-sm font-semibold text-ink mb-4">Timeline</h2>
            <StatusTimeline entries={application.statusHistory} />
          </section>
        </div>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit application">
        <ApplicationForm initialData={application} onSubmit={handleEditSubmit} onCancel={() => setIsEditOpen(false)} />
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete application?">
        <p className="text-sm text-muted mb-4">This will permanently delete this application and cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="!bg-danger !text-white !border-danger hover:!bg-danger/90">
            Delete
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isInterviewFormOpen}
        onClose={() => setIsInterviewFormOpen(false)}
        title={editingInterview ? "Edit interview" : "Add interview"}
      >
        <InterviewForm
          initialData={editingInterview ?? undefined}
          onSubmit={handleInterviewSubmit}
          onCancel={() => setIsInterviewFormOpen(false)}
        />
      </Modal>
    </div>
  );
}