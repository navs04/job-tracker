import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { Application, ApplicationStatus } from "../types/application";
import { STATUS_LABELS } from "../types/application";
import { fetchApplications, updateApplication } from "../api/applications";
import KanbanColumn from "../components/pipeline/KanbanColumn";
import KanbanCard from "../components/pipeline/KanbanCard";
import { notify } from "../lib/toast";
import LoadingState from "../components/ui/LoadingState";

const PIPELINE_STATUSES: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "ONLINE_ASSESSMENT",
  "INTERVIEW",
  "FINAL_ROUND",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

export default function Pipeline() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeApplication, setActiveApplication] = useState<Application | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setIsLoading(true);
    try {
      const data = await fetchApplications({ sortBy: "createdAt", sortOrder: "desc" });
      setApplications(data);
    } finally {
      setIsLoading(false);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const app = applications.find((a) => a.id === event.active.id);
    setActiveApplication(app ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveApplication(null);
    if (!over) return;

    const applicationId = active.id as string;
    const overIsColumn = PIPELINE_STATUSES.includes(over.id as ApplicationStatus);
    const newStatus = overIsColumn
    ? (over.id as ApplicationStatus)
    : applications.find((a) => a.id === over.id)?.status;
    
    if (!newStatus) return;

    const application = applications.find((a) => a.id === applicationId);
    if (!application || application.status === newStatus) return;

    // Optimistic update: reflect the move immediately, roll back on failure
    const previousStatus = application.status;
    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
    );

    try {
      await updateApplication(applicationId, { status: newStatus });
      notify.success("Moved to " + STATUS_LABELS[newStatus])
    } catch {
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: previousStatus } : a))
      );
      notify.error("Failed to update status — please try again.");
    }
  }


  if (isLoading) return <LoadingState label="Loading pipeline..." />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pipeline</h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              label={STATUS_LABELS[status]}
              applications={applications.filter((a) => a.status === status)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeApplication ? <KanbanCard application={activeApplication} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}