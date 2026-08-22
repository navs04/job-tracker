import { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, Award, BarChart3 } from "lucide-react";
import type { AnalyticsSummary } from "../types/analytics";
import { STATUS_LABELS } from "../types/application";
import { fetchAnalytics } from "../api/analytics";
import StatCard from "../components/dashboard/StatCard";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";

// Real status colors, resolved to hex since Recharts renders to raw SVG
// and can't read Tailwind/CSS-variable classes the way our JSX can.
const STATUS_HEX: Record<string, string> = {
  SAVED: "#6B7280",
  APPLIED: "#2563EB",
  ONLINE_ASSESSMENT: "#7C3AED",
  INTERVIEW: "#B45309",
  FINAL_ROUND: "#C2410C",
  OFFER: "#15803D",
  REJECTED: "#B91C1C",
  WITHDRAWN: "#78716C",
};

const ACCENT_HEX = "#4F46E5";
const BORDER_HEX = "#E7E5E2";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-md px-3 py-2 shadow-md text-xs">
      {label && <p className="font-medium text-ink mb-1">{label}</p>}
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-muted">
          {entry.name}: <span className="font-mono font-medium text-ink">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics()
      .then(setData)
      .catch(() => setLoadError("Failed to load analytics"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingState label="Loading analytics..." />;
  if (loadError || !data) return <ErrorState message={loadError ?? "Failed to load analytics"} />;

  const hasData = data.applicationsOverTime.length > 0;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ink tracking-tight">Analytics</h1>
        <p className="text-sm text-muted mt-1">Track your job search performance over time.</p>
      </div>

      {!hasData && (
        <EmptyState
          icon={BarChart3}
          message="No analytics yet"
          description="Add a few applications to start seeing trends and conversion rates here."
        />
      )}

      {hasData && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard label="Interview Conversion" value={`${data.interviewConversionRate}%`} icon={TrendingUp} accent="accent" />
            <StatCard label="Offer Conversion" value={`${data.offerConversionRate}%`} icon={Award} accent="success" />
            <StatCard label="Applications Tracked" value={data.funnel.applied} icon={BarChart3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <section className="bg-surface border border-border rounded-lg p-5">
              <h2 className="text-sm font-semibold text-ink mb-1">Applications over time</h2>
              <p className="text-xs text-faint mb-4">By month</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.applicationsOverTime} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={BORDER_HEX} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9B9B9E" }} axisLine={{ stroke: BORDER_HEX }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9B9B9E" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="count" name="Applications" stroke={ACCENT_HEX} strokeWidth={2} dot={{ r: 3, fill: ACCENT_HEX }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </section>

            <section className="bg-surface border border-border rounded-lg p-5">
              <h2 className="text-sm font-semibold text-ink mb-1">Applications by status</h2>
              <p className="text-xs text-faint mb-4">Current distribution</p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ResponsiveContainer width="55%" height={200}>
                  <PieChart>
                    <Pie data={data.applicationsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={2}>
                      {data.applicationsByStatus.map((entry) => (
                        <Cell key={entry.status} fill={STATUS_HEX[entry.status] ?? "#9CA3AF"} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }: any) =>
                        active && payload?.length ? (
                          <div className="bg-surface border border-border rounded-md px-3 py-2 shadow-md text-xs">
                            <p className="text-ink font-medium">
                              {STATUS_LABELS[payload[0].payload.status as keyof typeof STATUS_LABELS]}
                            </p>
                            <p className="font-mono text-muted">{payload[0].value}</p>
                          </div>
                        ) : null
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1.5 min-w-0">
                  {data.applicationsByStatus.map((entry) => (
                    <div key={entry.status} className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_HEX[entry.status] }} />
                      <span className="text-muted truncate">{STATUS_LABELS[entry.status as keyof typeof STATUS_LABELS]}</span>
                      <span className="font-mono text-faint ml-auto">{entry.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-surface border border-border rounded-lg p-5">
              <h2 className="text-sm font-semibold text-ink mb-1">Applications by source</h2>
              <p className="text-xs text-faint mb-4">Where your applications come from</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.applicationsBySource} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={BORDER_HEX} horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#9B9B9E" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="source" width={90} tick={{ fontSize: 11, fill: "#6B6B70" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "#FAFAF9" }} />
                  <Bar dataKey="count" name="Applications" fill={ACCENT_HEX} radius={[0, 4, 4, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="bg-surface border border-border rounded-lg p-5">
              <h2 className="text-sm font-semibold text-ink mb-1">Most successful sources</h2>
              <p className="text-xs text-faint mb-4">Offer rate by source (2+ applications)</p>
              {data.mostSuccessfulSources.length === 0 ? (
                <p className="text-sm text-faint py-10 text-center">Not enough data yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.mostSuccessfulSources.map((s) => (
                    <div key={s.source}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-ink">{s.source}</span>
                        <span className="font-mono text-xs text-status-offer font-medium">{s.successRate}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-canvas rounded-full h-1.5">
                          <div className="bg-status-offer h-1.5 rounded-full transition-all duration-300" style={{ width: `${s.successRate}%` }} />
                        </div>
                        <span className="text-xs text-faint shrink-0">{s.offers}/{s.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}