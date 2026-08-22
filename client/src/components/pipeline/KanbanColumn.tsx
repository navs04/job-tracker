import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Application, ApplicationStatus } from "../../types/application";
import { STATUS_STYLES } from "../../types/application";
import KanbanCard from "./KanbanCard";

interface KanbanColumnProps {
  status: ApplicationStatus;
  label: string;
  applications: Application[];
}

export default function KanbanColumn({ status, label, applications }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const style = STATUS_STYLES[status];

  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center gap-2 px-1 mb-2.5">
        <span className={`w-1.5 h-1.5 rounded-full ${style.text.replace("text-", "bg-")}`} />
        <h3 className="text-sm font-semibold text-ink">{label}</h3>
        <span className="font-mono text-xs text-faint ml-auto bg-canvas rounded px-1.5 py-0.5">
          {applications.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[240px] rounded-lg p-2 space-y-2 border-2 border-dashed transition-colors duration-150 ${
          isOver ? "border-accent bg-accent-bg/40" : "border-transparent bg-canvas/60"
        }`}
      >
        <SortableContext items={applications.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {applications.map((app) => (
            <KanbanCard key={app.id} application={app} />
          ))}
        </SortableContext>
        {applications.length === 0 && (
          <p className="text-xs text-faint text-center py-8">No applications</p>
        )}
      </div>
    </div>
  );
}