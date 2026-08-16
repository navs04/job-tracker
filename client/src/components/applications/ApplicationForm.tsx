import { useState, FormEvent } from "react";
import type { Application, ApplicationInput, ApplicationStatus, WorkMode, EmploymentType } from "../../types/application";
import { STATUS_LABELS } from "../../types/application";

interface ApplicationFormProps {
  initialData?: Application;
  onSubmit: (input: ApplicationInput) => Promise<void>;
  onCancel: () => void;
}

export default function ApplicationForm({ initialData, onSubmit, onCancel }: ApplicationFormProps) {
  const [company, setCompany] = useState(initialData?.company ?? "");
  const [jobTitle, setJobTitle] = useState(initialData?.jobTitle ?? "");
  const [jobUrl, setJobUrl] = useState(initialData?.jobUrl ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [workMode, setWorkMode] = useState<WorkMode | "">(initialData?.workMode ?? "");
  const [employmentType, setEmploymentType] = useState<EmploymentType | "">(initialData?.employmentType ?? "");
  const [status, setStatus] = useState<ApplicationStatus>(initialData?.status ?? "SAVED");
  const [source, setSource] = useState(initialData?.source ?? "");
  const [applicationDate, setApplicationDate] = useState(
    initialData?.applicationDate ? initialData.applicationDate.slice(0, 10) : ""
  );
  const [deadline, setDeadline] = useState(
    initialData?.deadline ? initialData.deadline.slice(0, 10) : ""
  );
  const [notes, setNotes] = useState(initialData?.notes ?? "");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        company,
        jobTitle,
        jobUrl: jobUrl || null,
        location: location || null,
        workMode: workMode || null,
        employmentType: employmentType || null,
        status,
        source: source || null,
        applicationDate: applicationDate || null,
        deadline: deadline || null,
        notes: notes || null,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save application");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Company *</label>
          <input required value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Job Title *</label>
          <input required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Job URL</label>
        <input value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} className={inputClass} placeholder="https://..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Work Mode</label>
          <select value={workMode} onChange={(e) => setWorkMode(e.target.value as WorkMode | "")} className={inputClass}>
            <option value="">—</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">On-site</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Employment Type</label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value as EmploymentType | "")}
            className={inputClass}
          >
            <option value="">—</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)} className={inputClass}>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Application Date</label>
          <input type="date" value={applicationDate} onChange={(e) => setApplicationDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Deadline</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Source</label>
        <input value={source} onChange={(e) => setSource(e.target.value)} className={inputClass} placeholder="LinkedIn, Referral, ..." />
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputClass} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : initialData ? "Save changes" : "Add application"}
        </button>
      </div>
    </form>
  );
}