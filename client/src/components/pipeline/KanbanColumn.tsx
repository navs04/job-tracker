import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Application, ApplicationStatus } from "../../types/application";
import KanbanCard from "./KanbanCard";

interface KanbanColumnProps {
  status: ApplicationStatus;
  label: string;
  applications: Application[];
}

export default function KanbanColumn({ status, label, applications }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
        <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
          {applications.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[200px] rounded-lg p-2 space-y-2 border-2 border-dashed transition-colors ${
          isOver ? "border-indigo-400 bg-indigo-50" : "border-transparent bg-gray-50"
        }`}
      >
        <SortableContext items={applications.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {applications.map((app) => (
            <KanbanCard key={app.id} application={app} />
          ))}
        </SortableContext>
        {applications.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">Drop here</p>
        )}
      </div>
    </div>
  );
}