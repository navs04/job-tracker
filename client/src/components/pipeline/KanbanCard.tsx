import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import type { Application } from "../../types/application";
import { formatDate } from "../../lib/format";

interface KanbanCardProps {
  application: Application;
}

export default function KanbanCard({ application }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: application.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-surface border border-border rounded-lg p-3 shadow-sm hover:border-ink/20 hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing touch-none"
    >
      <div className="flex items-start gap-2.5 mb-2">
        <div className="w-6 h-6 rounded-md bg-accent-bg flex items-center justify-center text-[11px] font-semibold text-accent shrink-0">
          {application.company[0]?.toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink truncate">{application.company}</p>
          <p className="text-xs text-muted truncate">{application.jobTitle}</p>
        </div>
      </div>

      {application.deadline && (
        <div className="flex items-center gap-1 text-xs text-faint mb-2">
          <Calendar size={11} strokeWidth={2} />
          <span className="font-mono">{formatDate(application.deadline)}</span>
        </div>
      )}

      <Link
        to={`/applications/${application.id}`}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="text-xs text-accent hover:underline font-medium"
      >
        View details →
      </Link>
    </div>
  );
}