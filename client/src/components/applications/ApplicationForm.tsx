import { useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle } from "lucide-react";
import type { Application, ApplicationInput, ApplicationStatus, WorkMode, EmploymentType } from "../../types/application";
import { STATUS_LABELS } from "../../types/application";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

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
  const [deadline, setDeadline] = useState(initialData?.deadline ? initialData.deadline.slice(0, 10) : "");
  const [notes, setNotes] = useState(initialData?.notes ?? "");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        company, jobTitle,
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

  const labelClass = "block text-xs font-medium text-muted mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 text-sm text-danger bg-danger-bg border border-danger/20 rounded-md px-3 py-2.5">
          <AlertCircle size={15} strokeWidth={2} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="company" className={labelClass}>Company *</label>
          <Input id="company" required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" />
        </div>
        <div>
          <label htmlFor="jobTitle" className={labelClass}>Job Title *</label>
          <Input id="jobTitle" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Software Engineer Intern" />
        </div>
      </div>

      <div>
        <label htmlFor="jobUrl" className={labelClass}>Job URL</label>
        <Input id="jobUrl" value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className={labelClass}>Location</label>
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco, CA" />
        </div>
        <div>
          <label htmlFor="workMode" className={labelClass}>Work Mode</label>
          <Select id="workMode" value={workMode} onChange={(e) => setWorkMode(e.target.value as WorkMode | "")} className="w-full">
            <option value="">—</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">On-site</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="employmentType" className={labelClass}>Employment Type</label>
          <Select id="employmentType" value={employmentType} onChange={(e) => setEmploymentType(e.target.value as EmploymentType | "")} className="w-full">
            <option value="">—</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
          </Select>
        </div>
        <div>
          <label htmlFor="status" className={labelClass}>Status</label>
          <Select id="status" value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)} className="w-full">
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="applicationDate" className={labelClass}>Application Date</label>
          <Input id="applicationDate" type="date" value={applicationDate} onChange={(e) => setApplicationDate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="deadline" className={labelClass}>Deadline</label>
          <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>
      </div>

      <div>
        <label htmlFor="source" className={labelClass}>Source</label>
        <Input id="source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="LinkedIn, Referral, ..." />
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-md text-sm text-ink placeholder:text-faint bg-white transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Save changes" : "Add application"}
        </Button>
      </div>
    </form>
  );
}