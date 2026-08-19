import { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { AnalyticsSummary } from "../types/analytics";
import { STATUS_LABELS } from "../types/application";
import { fetchAnalytics } from "../api/analytics";
import StatCard from "../components/dashboard/StatCard";

const STATUS_COLORS: Record<string, string> = {
  SAVED: "#9CA3AF",
  APPLIED: "#60A5FA",
  ONLINE_ASSESSMENT: "#818CF8",
  INTERVIEW: "#A78BFA",
  FINAL_ROUND: "#F472B6",
  OFFER: "#34D399",
  REJECTED: "#F87171",
  WITHDRAWN: "#D1D5DB",
};

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

  if (isLoading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (loadError || !data) return <div className="p-8 text-red-600">{loadError}</div>;

  const hasData = data.applicationsOverTime.length > 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>

      {!hasData && (
        <div className="text-center py-16 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          Add a few applications to start seeing analytics here.
        </div>
      )}

      {hasData && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Interview Conversion" value={`${data.interviewConversionRate}%`} accent="indigo" />
            <StatCard label="Offer Conversion" value={`${data.offerConversionRate}%`} accent="green" />
            <StatCard label="Applications Tracked" value={data.funnel.applied} />
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <section className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Applications over time</h2>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data.applicationsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </section>

            <section className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Applications by status</h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={data.applicationsByStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => STATUS_LABELS[entry.status as keyof typeof STATUS_LABELS]}
                  >
                    {data.applicationsByStatus.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "#9CA3AF"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, STATUS_LABELS[name as keyof typeof STATUS_LABELS] ?? name]} />
                </PieChart>
              </ResponsiveContainer>
            </section>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <section className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Applications by source</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.applicationsBySource} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="source" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366F1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Most successful sources</h2>
              {data.mostSuccessfulSources.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">
                  Not enough data yet — sources need at least 2 applications to appear here.
                </p>
              ) : (
                <div className="space-y-3">
                  {data.mostSuccessfulSources.map((s) => (
                    <div key={s.source} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{s.source}</p>
                        <p className="text-xs text-gray-500">{s.offers} offer(s) of {s.total} applications</p>
                      </div>
                      <span className="text-sm font-semibold text-green-600">{s.successRate}%</span>
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