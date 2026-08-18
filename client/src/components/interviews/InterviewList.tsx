import type { Interview } from "../../types/application";
import { formatDateTime } from "../../lib/format";

const OUTCOME_STYLES: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  PASSED: "bg-green-50 text-green-700",
  FAILED: "bg-red-50 text-red-700",
  CANCELLED: "bg-yellow-50 text-yellow-700",
};

interface InterviewListProps {
  interviews: Interview[];
  onEdit: (interview: Interview) => void;
  onDelete: (id: string) => void;
}

export default function InterviewList({ interviews, onEdit, onDelete }: InterviewListProps) {
  if (interviews.length === 0) {
    return <p className="text-sm text-gray-500">No interviews scheduled yet.</p>;
  }

  return (
    <div className="space-y-3">
      {interviews.map((interview) => (
        <div key={interview.id} className="border border-gray-200 rounded-md p-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{interview.round}</p>
              <p className="text-xs text-gray-500 mt-0.5">{formatDateTime(interview.scheduledAt)}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${OUTCOME_STYLES[interview.outcome] ?? OUTCOME_STYLES.PENDING}`}>
              {interview.outcome}
            </span>
          </div>

          {interview.interviewer && (
            <p className="text-xs text-gray-600 mt-2">Interviewer: {interview.interviewer}</p>
          )}
          {interview.meetingLink && (
            <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline mt-1 inline-block">
              Meeting link →
            </a>
          )}
          {interview.notes && <p className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">{interview.notes}</p>}

          <div className="flex gap-3 mt-2">
            <button onClick={() => onEdit(interview)} className="text-xs text-indigo-600 hover:underline">
              Edit
            </button>
            <button onClick={() => onDelete(interview.id)} className="text-xs text-red-600 hover:underline">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}