import { Video, User, FileText, ExternalLink, Pencil, Trash2, CalendarClock } from "lucide-react";
import type { Interview } from "../../types/application";
import { formatDateTime } from "../../lib/format";

const OUTCOME_STYLES: Record<string, { text: string; bg: string }> = {
  PENDING: { text: "text-muted", bg: "bg-canvas" },
  PASSED: { text: "text-status-offer", bg: "bg-status-offer-bg" },
  FAILED: { text: "text-status-rejected", bg: "bg-status-rejected-bg" },
  CANCELLED: { text: "text-status-withdrawn", bg: "bg-status-withdrawn-bg" },
};

const TYPE_LABELS: Record<string, string> = {
  PHONE_SCREEN: "Phone Screen",
  TECHNICAL: "Technical",
  BEHAVIORAL: "Behavioral",
  SYSTEM_DESIGN: "System Design",
  ONSITE: "Onsite",
  FINAL: "Final",
  OTHER: "Other",
};

interface InterviewListProps {
  interviews: Interview[];
  onEdit: (interview: Interview) => void;
  onDelete: (id: string) => void;
}

export default function InterviewList({ interviews, onEdit, onDelete }: InterviewListProps) {
  if (interviews.length === 0) {
    return (
      <div className="text-center py-8">
        <CalendarClock size={22} className="text-faint mx-auto mb-2" strokeWidth={1.5} />
        <p className="text-sm text-faint">No interviews scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {interviews.map((interview) => {
        const outcomeStyle = OUTCOME_STYLES[interview.outcome] ?? OUTCOME_STYLES.PENDING;
        return (
          <div key={interview.id} className="border border-border rounded-lg p-3.5 hover:border-ink/15 transition-colors duration-150">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-ink">{interview.round}</p>
                <p className="text-xs text-muted">{TYPE_LABELS[interview.type] ?? interview.type}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${outcomeStyle.bg} ${outcomeStyle.text}`}>
                {interview.outcome}
              </span>
            </div>

            <p className="font-mono text-xs text-faint mb-2.5">{formatDateTime(interview.scheduledAt)}</p>

            <div className="space-y-1.5">
              {interview.interviewer && (
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <User size={12} strokeWidth={2} className="shrink-0" />
                  {interview.interviewer}
                </div>
              )}
              {interview.meetingLink && (
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-accent hover:underline w-fit"
                >
                  <Video size={12} strokeWidth={2} className="shrink-0" />
                  Meeting link
                  <ExternalLink size={10} strokeWidth={2} />
                </a>
              )}
              {interview.notes && (
                <div className="flex items-start gap-1.5 text-xs text-muted">
                  <FileText size={12} strokeWidth={2} className="shrink-0 mt-0.5" />
                  <span className="whitespace-pre-wrap">{interview.notes}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-3 pt-3 border-t border-border">
              <button
                onClick={() => onEdit(interview)}
                className="flex items-center gap-1 text-xs text-accent hover:underline font-medium"
              >
                <Pencil size={11} strokeWidth={2} />
                Edit
              </button>
              <button
                onClick={() => onDelete(interview.id)}
                className="flex items-center gap-1 text-xs text-danger hover:underline font-medium"
              >
                <Trash2 size={11} strokeWidth={2} />
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}