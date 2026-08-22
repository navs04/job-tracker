import { useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle } from "lucide-react";
import type { Interview } from "../../types/application";
import type { InterviewInput } from "../../api/interviews";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

interface InterviewFormProps {
  initialData?: Interview;
  onSubmit: (input: InterviewInput) => Promise<void>;
  onCancel: () => void;
}

const INTERVIEW_TYPE_LABELS: Record<string, string> = {
  PHONE_SCREEN: "Phone Screen", TECHNICAL: "Technical", BEHAVIORAL: "Behavioral",
  SYSTEM_DESIGN: "System Design", ONSITE: "Onsite", FINAL: "Final", OTHER: "Other",
};
const OUTCOME_LABELS: Record<string, string> = {
  PENDING: "Pending", PASSED: "Passed", FAILED: "Failed", CANCELLED: "Cancelled",
};

export default function InterviewForm({ initialData, onSubmit, onCancel }: InterviewFormProps) {
  const [round, setRound] = useState(initialData?.round ?? "");
  const [scheduledAt, setScheduledAt] = useState(initialData?.scheduledAt ? initialData.scheduledAt.slice(0, 16) : "");
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
          <label htmlFor="round" className={labelClass}>Round *</label>
          <Input id="round" required value={round} onChange={(e) => setRound(e.target.value)} placeholder="e.g. Round 1" />
        </div>
        <div>
          <label htmlFor="type" className={labelClass}>Type</label>
          <Select id="type" value={type} onChange={(e) => setType(e.target.value)} className="w-full">
            {Object.entries(INTERVIEW_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <label htmlFor="scheduledAt" className={labelClass}>Date & time *</label>
        <Input id="scheduledAt" type="datetime-local" required value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="interviewer" className={labelClass}>Interviewer</label>
          <Input id="interviewer" value={interviewer} onChange={(e) => setInterviewer(e.target.value)} />
        </div>
        <div>
          <label htmlFor="outcome" className={labelClass}>Outcome</label>
          <Select id="outcome" value={outcome} onChange={(e) => setOutcome(e.target.value)} className="w-full">
            {Object.entries(OUTCOME_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <label htmlFor="meetingLink" className={labelClass}>Meeting link</label>
        <Input id="meetingLink" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://..." />
      </div>

      <div>
        <label htmlFor="interviewNotes" className={labelClass}>Notes</label>
        <textarea
          id="interviewNotes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-md text-sm text-ink placeholder:text-faint bg-white transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Save changes" : "Add interview"}
        </Button>
      </div>
    </form>
  );
}