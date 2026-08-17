import { useEffect, useState } from "react";
import type { Application, ApplicationInput } from "../types/application";
import { STATUS_LABELS } from "../types/application";
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  type ApplicationFilters,
} from "../api/applications";
import { useDebounce } from "../hooks/useDebounce";
import Modal from "../components/ui/Modal";
import ApplicationForm from "../components/applications/ApplicationForm";
import FilterBar from "../components/applications/FilterBar";
import { Link } from "react-router-dom";

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
    if (editingApplication) {
      const updated = await updateApplication(editingApplication.id, input);
      setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } else {
      const created = await createApplication(input);
      // Instead of manually inserting, just reload so it respects current filters/sort
      loadApplications();
    }
    setIsFormOpen(false);
  }

  async function handleConfirmDelete() {
    if (!deletingId) return;
    await deleteApplication(deletingId);
    setApplications((prev) => prev.filter((a) => a.id !== deletingId));
    setDeletingId(null);
  }

  return (
     <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <button onClick={openCreateForm} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
          + Add application
        </button>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {isLoading && <p className="text-gray-500">Loading...</p>}
      {loadError && <p className="text-red-600">{loadError}</p>}

      {!isLoading && !loadError && applications.length === 0 && (
        <div className="text-center py-16 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          {filters.search || filters.status || filters.workMode || filters.employmentType
            ? "No applications match your filters."
            : 'No applications yet. Click "Add application" to create your first one.'}
        </div>
      )}

      {!isLoading && applications.length > 0 && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Job Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                   <td className="px-4 py-3 font-medium text-gray-900">
                    <Link to={`/applications/${app.id}`} className="hover:underline">
                    {app.company}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{app.jobTitle}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
                      {STATUS_LABELS[app.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{app.location || "—"}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEditForm(app)} className="text-indigo-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => setDeletingId(app.id)} className="text-red-600 hover:underline">
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
        <p className="text-sm text-gray-600 mb-4">
          This will permanently delete this application and cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeletingId(null)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
            Cancel
          </button>
          <button onClick={handleConfirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}