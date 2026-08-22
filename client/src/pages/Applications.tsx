import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FolderOpen } from "lucide-react";
import type { Application, ApplicationInput } from "../types/application";
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  type ApplicationFilters,
} from "../api/applications";
import { useDebounce } from "../hooks/useDebounce";
import { formatDate } from "../lib/format";
import { notify } from "../lib/toast";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import ApplicationForm from "../components/applications/ApplicationForm";
import FilterBar from "../components/applications/FilterBar";

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ApplicationFilters>({ sortBy: "createdAt", sortOrder: "desc" });
  const debouncedSearch = useDebounce(filters.search, 300);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, [debouncedSearch, filters.status, filters.workMode, filters.employmentType, filters.location, filters.sortBy, filters.sortOrder]);

  async function loadApplications() {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await fetchApplications({ ...filters, search: debouncedSearch });
      setApplications(data);
    } catch {
      setLoadError("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateForm() {
    setEditingApplication(null);
    setIsFormOpen(true);
  }

  function openEditForm(application: Application) {
    setEditingApplication(application);
    setIsFormOpen(true);
  }

  async function handleFormSubmit(input: ApplicationInput) {
    try {
      if (editingApplication) {
        const updated = await updateApplication(editingApplication.id, input);
        setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        notify.success("Application updated");
      } else {
        await createApplication(input);
        loadApplications();
        notify.success("Application added");
      }
      setIsFormOpen(false);
    } catch (err: any) {
      notify.error(err.response?.data?.error || "Failed to save application");
    }
  }

  async function handleConfirmDelete() {
    if (!deletingId) return;
    try {
      await deleteApplication(deletingId);
      setApplications((prev) => prev.filter((a) => a.id !== deletingId));
      setDeletingId(null);
      notify.success("Application deleted");
    } catch {
      notify.error("Failed to delete application");
    }
  }

  const hasActiveFilters = !!(filters.search || filters.status || filters.workMode || filters.employmentType);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">Applications</h1>
          <p className="text-sm text-muted mt-1">{applications.length} total</p>
        </div>
        <Button variant="primary" onClick={openCreateForm} className="flex items-center gap-1.5 shrink-0">
          <Plus size={15} strokeWidth={2.5} />
          Add application
        </Button>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {isLoading && <LoadingState label="Loading applications..." />}
      {loadError && <ErrorState message={loadError} onRetry={loadApplications} />}

      {!isLoading && !loadError && applications.length === 0 && (
        <EmptyState
          icon={FolderOpen}
          message={hasActiveFilters ? "No applications match your filters" : "No applications yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your search or filters."
              : "Start tracking your job search by adding your first application."
          }
          action={hasActiveFilters ? undefined : { label: "+ Add your first application", onClick: openCreateForm }}
        />
      )}

      {!isLoading && applications.length > 0 && (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-canvas text-left text-muted border-b border-border">
              <tr>
                <th className="px-4 py-2.5 font-medium text-xs uppercase tracking-wide">Company</th>
                <th className="px-4 py-2.5 font-medium text-xs uppercase tracking-wide">Job Title</th>
                <th className="px-4 py-2.5 font-medium text-xs uppercase tracking-wide">Status</th>
                <th className="px-4 py-2.5 font-medium text-xs uppercase tracking-wide">Location</th>
                <th className="px-4 py-2.5 font-medium text-xs uppercase tracking-wide">Applied</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {applications.map((app) => (
                <tr key={app.id} className="group hover:bg-canvas transition-colors duration-150">
                  <td className="px-4 py-3">
                    <Link to={`/applications/${app.id}`} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-accent-bg flex items-center justify-center text-xs font-semibold text-accent shrink-0">
                        {app.company[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-ink group-hover:text-accent transition-colors duration-150">
                        {app.company}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink/80">{app.jobTitle}</td>
                  <td className="px-4 py-3"><Badge status={app.status} /></td>
                  <td className="px-4 py-3 text-muted">{app.location || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-faint">{formatDate(app.applicationDate)}</td>
                  <td className="px-4 py-3 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button onClick={() => openEditForm(app)} className="text-accent hover:underline text-xs font-medium">
                      Edit
                    </button>
                    <button onClick={() => setDeletingId(app.id)} className="text-danger hover:underline text-xs font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingApplication ? "Edit application" : "Add application"}
      >
        <ApplicationForm
          initialData={editingApplication ?? undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Delete application?">
        <p className="text-sm text-muted mb-4">This will permanently delete this application and cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeletingId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmDelete} className="!bg-danger !text-white !border-danger hover:!bg-danger/90">
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}