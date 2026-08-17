import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";
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
      className="bg-white border border-gray-200 rounded-md p-3 shadow-sm cursor-grab active:cursor-grabbing touch-none"
    >
      <p className="text-sm font-medium text-gray-900">{application.company}</p>
      <p className="text-xs text-gray-600 mt-0.5">{application.jobTitle}</p>
      {application.deadline && (
        <p className="text-xs text-gray-400 mt-2">Due {formatDate(application.deadline)}</p>
      )}
      <Link
        to={`/applications/${application.id}`}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="text-xs text-indigo-600 hover:underline mt-2 inline-block"
      >
        View details →
      </Link>
    </div>
  );
}