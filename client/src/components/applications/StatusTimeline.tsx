import type { StatusHistoryEntry } from "../../types/application";
import { STATUS_LABELS, STATUS_STYLES } from "../../types/application";
import { formatDateTime } from "../../lib/format";

interface StatusTimelineProps {
  entries: StatusHistoryEntry[];
}

export default function StatusTimeline({ entries }: StatusTimelineProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-faint">No status history yet.</p>;
  }

  return (
    <ol className="relative">
      {entries.map((entry, index) => {
        const isLatest = index === entries.length - 1;
        const style = STATUS_STYLES[entry.toStatus];
        return (
          <li key={entry.id} className="relative pl-6 pb-5 last:pb-0">
            {index !== entries.length - 1 && (
              <span className="absolute left-[7px] top-4 bottom-0 w-px bg-border" />
            )}
            <span
              className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 ${
                isLatest ? "border-accent bg-accent" : "border-border bg-surface"
              }`}
            />
            <p className="text-sm font-medium text-ink">
              {entry.fromStatus && (
                <span className="text-faint font-normal">{STATUS_LABELS[entry.fromStatus]} → </span>
              )}
              <span className={style.text}>{STATUS_LABELS[entry.toStatus]}</span>
            </p>
            <p className="font-mono text-xs text-faint mt-0.5">{formatDateTime(entry.changedAt)}</p>
          </li>
        );
      })}
    </ol>
  );
}