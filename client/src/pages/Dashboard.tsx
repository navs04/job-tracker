import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, TrendingUp, Users, CheckCircle2, XCircle, Plus } from "lucide-react";
import type { DashboardSummary } from "../types/application";
import { fetchDashboardSummary } from "../api/dashboard";
import { formatDate } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/dashboard/StatCard";
import StatusBar from "../components/dashboard/StatusBar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import LoadingState from "../components/ui/LoadingState";

export default function Dashboard() {
  const { user } = useAuth();
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
  if (loadError || !summary) return <div className="p-8 text-danger">{loadError}</div>;

  const activePipeline = summary.totalApplications - summary.offers - summary.rejections;
  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">
            {firstName ? `Welcome back, ${firstName}` : "Dashboard"}
          </h1>
          <p className="text-sm text-muted mt-1">
            {activePipeline > 0
              ? `You have ${activePipeline} active application${activePipeline === 1 ? "" : "s"} in progress.`
              : "Here's an overview of your job search."}
          </p>
        </div>
        <Link to="/applications">
          <Button variant="primary" className="flex items-center gap-1.5">
            <Plus size={15} strokeWidth={2.5} />
            Add Application
          </Button>
        </Link>
      </div>

     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total" value={summary.totalApplications} icon={Briefcase} accent="accent" />
        <StatCard
          label="This Month"
          value={summary.applicationsThisMonth}
          icon={TrendingUp}
          helper={`${summary.applicationsThisWeek} this week`}
        />
        <StatCard label="Interviews" value={summary.interviewsScheduled} icon={Users} accent="accent" />
        <StatCard label="Offers" value={summary.offers} icon={CheckCircle2} accent="success" />
        <StatCard label="Rejections" value={summary.rejections} icon={XCircle} accent="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-surface border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-ink">Applications by status</h2>
              <span className="font-mono text-xs text-faint">{summary.successRate}% success rate</span>
            </div>
            <StatusBar breakdown={summary.statusBreakdown} />
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-ink">Recent applications</h2>
              <Link to="/applications" className="text-xs text-accent hover:underline font-medium">
                View all
              </Link>
            </div>
            <div className="bg-surface border border-border rounded-lg divide-y divide-border">
              {summary.recentApplications.length === 0 && (
                <p className="text-sm text-faint p-4">No applications yet.</p>
              )}
              {summary.recentApplications.map((app) => (
                <Link
                  key={app.id}
                  to={`/applications/${app.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-canvas transition-colors duration-150"
                >
                  <div className="w-8 h-8 rounded-md bg-accent-bg flex items-center justify-center text-xs font-semibold text-accent shrink-0">
                    {app.company[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate">{app.company}</p>
                    <p className="text-xs text-muted truncate">{app.jobTitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge status={app.status} />
                    <p className="font-mono text-xs text-faint mt-1">{formatDate(app.applicationDate)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-sm font-semibold text-ink mb-3">Upcoming deadlines</h2>
            <div className="bg-surface border border-border rounded-lg divide-y divide-border">
              {summary.upcomingDeadlines.length === 0 && (
                <p className="text-sm text-faint p-4">No upcoming deadlines.</p>
              )}
              {summary.upcomingDeadlines.map((app) => (
                <Link
                  key={app.id}
                  to={`/applications/${app.id}`}
                  className="block px-4 py-3 hover:bg-canvas transition-colors duration-150"
                >
                  <p className="text-sm font-medium text-ink truncate">{app.company}</p>
                  <p className="font-mono text-xs text-status-final mt-0.5">{formatDate(app.deadline)}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-ink mb-3">Upcoming interviews</h2>
            <div className="bg-surface border border-border rounded-lg divide-y divide-border">
              {summary.upcomingInterviews.length === 0 && (
                <p className="text-sm text-faint p-4">No upcoming interviews.</p>
              )}
              {summary.upcomingInterviews.map((interview) => (
                <Link
                  key={interview.id}
                  to={`/applications/${interview.application.id}`}
                  className="block px-4 py-3 hover:bg-canvas transition-colors duration-150"
                >
                  <p className="text-sm font-medium text-ink truncate">{interview.application.company}</p>
                  <p className="text-xs text-muted truncate">{interview.round}</p>
                  <p className="font-mono text-xs text-accent mt-0.5">
                    {formatDate(interview.scheduledAt)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}