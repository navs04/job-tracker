import type { StatusHistoryEntry } from "../../types/application";
import { STATUS_LABELS } from "../../types/application";
import { formatDateTime } from "../../lib/format";

interface StatusTimelineProps {
  entries: StatusHistoryEntry[];
}

export default function StatusTimeline({ entries }: StatusTimelineProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-gray-500">No status history yet.</p>;
  }

  return (
    <ol className="relative border-l border-gray-200 ml-2">
      {entries.map((entry, index) => (
        <li key={entry.id} className="mb-6 ml-4 last:mb-0">
          <div
            className={`absolute w-2.5 h-2.5 rounded-full -left-[5px] mt-1.5 ${
              index === entries.length - 1 ? "bg-indigo-600" : "bg-gray-300"
            }`}
          />
          <p className="text-sm font-medium text-gray-900">
            {entry.fromStatus ? `${STATUS_LABELS[entry.fromStatus]} → ` : ""}
            {STATUS_LABELS[entry.toStatus]}
          </p>
          <p className="text-xs text-gray-500">{formatDateTime(entry.changedAt)}</p>
        </li>
      ))}
    </ol>
  );
}