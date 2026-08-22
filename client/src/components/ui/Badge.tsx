import type { ApplicationStatus } from "../../types/application";
import { STATUS_LABELS, STATUS_STYLES } from "../../types/application";

interface BadgeProps {
  status: ApplicationStatus;
}

export default function Badge({ status }: BadgeProps) {
  const style = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}