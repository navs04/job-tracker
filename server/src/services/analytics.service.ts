import prisma from "../lib/prisma";

export async function getAnalytics(userId: string) {
  const [applications, statusHistoryEntries] = await Promise.all([
    prisma.application.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        source: true,
        applicationDate: true,
        createdAt: true,
      },
    }),
    prisma.statusHistoryEntry.findMany({
      where: { application: { userId } },
      select: { toStatus: true, changedAt: true },
    }),
  ]);

  // Applications over time — group by month using applicationDate (falling
  // back to createdAt for applications where that wasn't set).
  const byMonth = new Map<string, number>();
  for (const app of applications) {
    const date = app.applicationDate ?? app.createdAt;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
  }
  const applicationsOverTime = Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  // Applications by status
  const byStatus = new Map<string, number>();
  for (const app of applications) {
    byStatus.set(app.status, (byStatus.get(app.status) ?? 0) + 1);
  }
  const applicationsByStatus = Array.from(byStatus.entries()).map(([status, count]) => ({ status, count }));

  // Applications by source (group missing/empty sources under "Unknown")
  const bySource = new Map<string, number>();
  for (const app of applications) {
    const key = app.source?.trim() || "Unknown";
    bySource.set(key, (bySource.get(key) ?? 0) + 1);
  }
  const applicationsBySource = Array.from(bySource.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  // Conversion funnel: how many applications ever reached each stage, based
  // on distinct applications that have a status-history entry for that
  // status — not current status, since an app that reached Interview and
  // was later Rejected should still count toward "reached Interview."
  const reachedStage = new Set<string>();
  const stageReachedBy: Record<string, Set<string>> = {
    APPLIED: new Set(),
    INTERVIEW: new Set(),
    OFFER: new Set(),
  };

  const historyByApp = await prisma.statusHistoryEntry.findMany({
    where: { application: { userId } },
    select: { applicationId: true, toStatus: true },
  });
  for (const entry of historyByApp) {
    if (entry.toStatus === "APPLIED") stageReachedBy.APPLIED.add(entry.applicationId);
    if (entry.toStatus === "INTERVIEW" || entry.toStatus === "FINAL_ROUND") stageReachedBy.INTERVIEW.add(entry.applicationId);
    if (entry.toStatus === "OFFER") stageReachedBy.OFFER.add(entry.applicationId);
  }

  const appliedCount = stageReachedBy.APPLIED.size;
  const interviewCount = stageReachedBy.INTERVIEW.size;
  const offerCount = stageReachedBy.OFFER.size;

  const interviewConversionRate = appliedCount > 0 ? Math.round((interviewCount / appliedCount) * 100) : 0;
  const offerConversionRate = interviewCount > 0 ? Math.round((offerCount / interviewCount) * 100) : 0;

  // Most successful sources: of applications from each source, what
  // fraction resulted in an offer? Only sources with at least 2
  // applications are included, so a single lucky application doesn't
  // show as a "100% success rate" source.
  const sourceStats = new Map<string, { total: number; offers: number }>();
  for (const app of applications) {
    const key = app.source?.trim() || "Unknown";
    const stats = sourceStats.get(key) ?? { total: 0, offers: 0 };
    stats.total += 1;
    if (app.status === "OFFER") stats.offers += 1;
    sourceStats.set(key, stats);
  }
  const mostSuccessfulSources = Array.from(sourceStats.entries())
    .filter(([, stats]) => stats.total >= 2)
    .map(([source, stats]) => ({
      source,
      total: stats.total,
      offers: stats.offers,
      successRate: Math.round((stats.offers / stats.total) * 100),
    }))
    .sort((a, b) => b.successRate - a.successRate);

  return {
    applicationsOverTime,
    applicationsByStatus,
    applicationsBySource,
    interviewConversionRate,
    offerConversionRate,
    funnel: { applied: appliedCount, interview: interviewCount, offer: offerCount },
    mostSuccessfulSources,
  };
}