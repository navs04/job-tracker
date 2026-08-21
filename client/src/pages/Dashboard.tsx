import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { DashboardSummary } from "../types/application";
import { STATUS_LABELS } from "../types/application";
import { fetchDashboardSummary } from "../api/dashboard";
import { formatDate, formatDateTime } from "../lib/format";
import StatCard from "../components/dashboard/StatCard";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);


  useEffect(() => {
    fetchDashboardSummary()
      .then(setSummary)
      .catch(() => setLoadError("Failed to load dashboard"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingState label="Loading dashboard..." />;
  if (loadError || !summary) return <ErrorState message={loadError ?? "Failed to load dashboard"} />;

  const statusOrder: (keyof typeof STATUS_LABELS)[] = [
    "SAVED", "APPLIED", "ONLINE_ASSESSMENT", "INTERVIEW", "FINAL_ROUND", "OFFER", "REJECTED", "WITHDRAWN",
  ];
  const maxStatusCount = Math.max(1, ...Object.values(summary.statusBreakdown));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Applications" value={summary.totalApplications} />
        <StatCard label="This Week" value={summary.applicationsThisWeek} />
        <StatCard label="This Month" value={summary.applicationsThisMonth} />
        <StatCard label="Success Rate" value={`${summary.successRate}%`} accent="indigo" />
        <StatCard label="Interviews Scheduled" value={summary.interviewsScheduled} accent="indigo" />
        <StatCard label="Offers" value={summary.offers} accent="green" />
        <StatCard label="Rejections" value={summary.rejections} accent="red" />
        <StatCard label="Active Pipeline" value={summary.totalApplications - summary.offers - summary.rejections} />
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Applications by status</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
              {statusOrder.map((status) => {
                const count = summary.statusBreakdown[status] ?? 0;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-32 shrink-0">{STATUS_LABELS[status]}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${(count / maxStatusCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Recent applications</h2>
              <Link to="/applications" className="text-xs text-indigo-600 hover:underline">View all</Link>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
              {summary.recentApplications.length === 0 && (
                <p className="text-sm text-gray-500 p-4">No applications yet.</p>
              )}
              {summary.recentApplications.map((app) => (
                <Link
                  key={app.id}
                  to={`/applications/${app.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{app.company}</p>
                    <p className="text-xs text-gray-500">{app.jobTitle}</p>
                  </div>
                  <span className="text-xs text-gray-400">{STATUS_LABELS[app.status]}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Upcoming deadlines</h2>
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
              {summary.upcomingDeadlines.length === 0 && (
                <p className="text-sm text-gray-500 p-4">No upcoming deadlines.</p>
              )}
              {summary.upcomingDeadlines.map((app) => (
                <Link key={app.id} to={`/applications/${app.id}`} className="block px-4 py-3 hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">{app.company}</p>
                  <p className="text-xs text-gray-500">{formatDate(app.deadline)}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Upcoming interviews</h2>
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
              {summary.upcomingInterviews.length === 0 && (
                <p className="text-sm text-gray-500 p-4">No upcoming interviews.</p>
              )}
              {summary.upcomingInterviews.map((interview) => (
                <div key={interview.id} className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{interview.application.company}</p>
                  <p className="text-xs text-gray-500">{interview.round} — {formatDateTime(interview.scheduledAt)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}