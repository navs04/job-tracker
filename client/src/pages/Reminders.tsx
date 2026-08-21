import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { RemindersSummary } from "../types/reminders";
import { fetchReminders } from "../api/reminders";
import { formatDate, formatDateTime } from "../lib/format";
import LoadingState from "../components/ui/LoadingState";
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
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reminders</h1>

      {!hasAnything && (
        <div className="text-center py-16 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          Nothing due or upcoming right now.
        </div>
      )}

      {data.overdue.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-red-700 mb-3">
            Overdue ({data.overdue.length})
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg divide-y divide-red-100">
            {data.overdue.map((item) => (
              <Link
                key={item.id}
                to={`/applications/${item.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-red-100/50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.company}</p>
                  <p className="text-xs text-gray-600">{item.jobTitle}</p>
                </div>
                <span className="text-xs font-medium text-red-700">
                  Deadline was {formatDate(item.deadline)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {data.upcoming.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Upcoming ({data.upcoming.length})
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {data.upcoming.map((item, index) => (
              <Link
                key={`${item.type}-${item.application.id}-${index}`}
                to={`/applications/${item.application.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.application.company}</p>
                  <p className="text-xs text-gray-500">
                    {item.type === "deadline"
                      ? `Deadline — ${item.application.jobTitle}`
                      : `Interview (${item.round}) — ${item.application.jobTitle}`}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {item.type === "deadline" ? formatDate(item.date) : formatDateTime(item.date)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}