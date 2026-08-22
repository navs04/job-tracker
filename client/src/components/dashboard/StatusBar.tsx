import type { ApplicationStatus } from "../../types/application";
import { STATUS_LABELS} from "../../types/application";

interface StatusBarProps {
  breakdown: Partial<Record<ApplicationStatus, number>>;
}

const STATUS_ORDER: ApplicationStatus[] = [
  "SAVED", "APPLIED", "ONLINE_ASSESSMENT", "INTERVIEW", "FINAL_ROUND", "OFFER", "REJECTED", "WITHDRAWN",
];

// Maps our subtle bg tokens to a slightly stronger fill for the bar itself,
// since the bg tokens were designed for badges, not bar fills.
const BAR_FILL: Record<ApplicationStatus, string> = {
  SAVED: "bg-status-saved",
  APPLIED: "bg-status-applied",
  ONLINE_ASSESSMENT: "bg-status-assessment",
  INTERVIEW: "bg-status-interview",
  FINAL_ROUND: "bg-status-final",
  OFFER: "bg-status-offer",
  REJECTED: "bg-status-rejected",
  WITHDRAWN: "bg-status-withdrawn",
};

export default function StatusBar({ breakdown }: StatusBarProps) {
  const maxCount = Math.max(1, ...Object.values(breakdown));

  return (
    <div className="space-y-3">
      {STATUS_ORDER.map((status) => {
        const count = breakdown[status] ?? 0;
        return (
          <div key={status} className="flex items-center gap-3">
            <span className="text-xs text-muted w-32 shrink-0">{STATUS_LABELS[status]}</span>
            <div className="flex-1 bg-canvas rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${BAR_FILL[status]}`}
                style={{ width: count > 0 ? `${(count / maxCount) * 100}%` : "0%" }}
              />
            </div>
            <span className="font-mono text-xs text-faint w-6 text-right">{count}</span>
          </div>
        );
      })}
    </div>
  );
}