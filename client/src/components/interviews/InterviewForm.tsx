import { useState, FormEvent } from "react";
import type { Interview } from "../../types/application";
import type { InterviewInput } from "../../api/interviews";

interface InterviewFormProps {
  initialData?: Interview;
  onSubmit: (input: InterviewInput) => Promise<void>;
  onCancel: () => void;
}

const INTERVIEW_TYPE_LABELS: Record<string, string> = {
  PHONE_SCREEN: "Phone Screen",
  TECHNICAL: "Technical",
  BEHAVIORAL: "Behavioral",
  SYSTEM_DESIGN: "System Design",
  ONSITE: "Onsite",
  FINAL: "Final",
  OTHER: "Other",
};

const OUTCOME_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PASSED: "Passed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

export default function InterviewForm({ initialData, onSubmit, onCancel }: InterviewFormProps) {
  const [round, setRound] = useState(initialData?.round ?? "");
  const [scheduledAt, setScheduledAt] = useState(
    initialData?.scheduledAt ? initialData.scheduledAt.slice(0, 16) : ""
  );
  const [type, setType] = useState(initialData?.type ?? "TECHNICAL");
  const [interviewer, setInterviewer] = useState(initialData?.interviewer ?? "");
  const [meetingLink, setMeetingLink] = useState(initialData?.meetingLink ?? "");
  const [outcome, setOutcome] = useState(initialData?.outcome ?? "PENDING");
  const [notes, setNotes] = useState(initialData?.notes ?? "");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        round,
        scheduledAt: new Date(scheduledAt).toISOString(),
        type,
        interviewer: interviewer || null,
        meetingLink: meetingLink || null,
        outcome,
        notes: notes || null,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save interview");
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
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Round *</label>
          <input required value={round} onChange={(e) => setRound(e.target.value)} className={inputClass} placeholder="e.g. Round 1" />
        </div>
        <div>
          <label className={labelClass}>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            {Object.entries(INTERVIEW_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Date & time *</label>
        <input
          type="datetime-local"
          required
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Interviewer</label>
          <input value={interviewer} onChange={(e) => setInterviewer(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Outcome</label>
          <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className={inputClass}>
            {Object.entries(OUTCOME_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Meeting link</label>
        <input value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} className={inputClass} placeholder="https://..." />
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
          {isSubmitting ? "Saving..." : initialData ? "Save changes" : "Add interview"}
        </button>
      </div>
    </form>
  );
}