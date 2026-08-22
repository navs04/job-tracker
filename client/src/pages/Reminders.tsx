import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CalendarClock, Video, Calendar } from "lucide-react";
import type { RemindersSummary } from "../types/reminders";
import { fetchReminders } from "../api/reminders";
import { formatDate, formatDateTime } from "../lib/format";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";

export default function Reminders() {
  const [data, setData] = useState<RemindersSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetchReminders()
      .then(setData)
      .catch(() => setLoadError("Failed to load reminders"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingState label="Loading reminders..." />;
  if (loadError || !data) return <ErrorState message={loadError ?? "Failed to load reminders"} />;

  const hasAnything = data.overdue.length > 0 || data.upcoming.length > 0;

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ink tracking-tight">Reminders</h1>
        <p className="text-sm text-muted mt-1">Deadlines and interviews that need your attention.</p>
      </div>

      {!hasAnything && (
        <EmptyState
          icon={CalendarClock}
          message="Nothing due or upcoming"
          description="You're all caught up — check back as new deadlines and interviews come in."
        />
      )}

      {data.overdue.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} className="text-danger" strokeWidth={2} />
            <h2 className="text-sm font-semibold text-danger">Overdue ({data.overdue.length})</h2>
          </div>
          <div className="bg-danger-bg border border-danger/20 rounded-lg divide-y divide-danger/10">
            {data.overdue.map((item) => (
              <Link
                key={item.id}
                to={`/applications/${item.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-danger/5 transition-colors duration-150"
              >
                <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-xs font-semibold text-danger shrink-0">
                  {item.company[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink truncate">{item.company}</p>
                  <p className="text-xs text-muted truncate">{item.jobTitle}</p>
                </div>
                <span className="font-mono text-xs font-medium text-danger shrink-0">
                  {formatDate(item.deadline)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {data.upcoming.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-ink mb-3">Upcoming ({data.upcoming.length})</h2>
          <div className="bg-surface border border-border rounded-lg divide-y divide-border">
            {data.upcoming.map((item, index) => {
              const Icon = item.type === "interview" ? Video : Calendar;
              return (
                <Link
                  key={`${item.type}-${item.application.id}-${index}`}
                  to={`/applications/${item.application.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-canvas transition-colors duration-150"
                >
                  <div className="w-8 h-8 rounded-md bg-accent-bg flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-accent" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate">{item.application.company}</p>
                    <p className="text-xs text-muted truncate">
                      {item.type === "deadline" ? `Deadline — ${item.application.jobTitle}` : `${item.round} — ${item.application.jobTitle}`}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-faint shrink-0">
                    {item.type === "deadline" ? formatDate(item.date) : formatDateTime(item.date)}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}