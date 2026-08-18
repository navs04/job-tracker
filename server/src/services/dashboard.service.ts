import prisma from "../lib/prisma";

export async function getDashboardSummary(userId: string) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalApplications,
    statusCounts,
    applicationsThisWeek,
    applicationsThisMonth,
    recentApplications,
    upcomingDeadlines,
    upcomingInterviews,
  ] = await Promise.all([
    prisma.application.count({ where: { userId } }),

    prisma.application.groupBy({
      by: ["status"],
      where: { userId },
      _count: true,
    }),

    prisma.application.count({
      where: { userId, applicationDate: { gte: startOfWeek } },
    }),

    prisma.application.count({
      where: { userId, applicationDate: { gte: startOfMonth } },
    }),

    prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),

    prisma.application.findMany({
      where: { userId, deadline: { gte: now } },
      orderBy: { deadline: "asc" },
      take: 5,
    }),

    prisma.interview.findMany({
      where: { application: { userId }, scheduledAt: { gte: now } },
      orderBy: { scheduledAt: "asc" },
      take: 5,
      include: { application: { select: { company: true, jobTitle: true } } },
    }),
  ]);

  const statusMap = Object.fromEntries(statusCounts.map((s) => [s.status, s._count]));

  const interviewsScheduled = (statusMap["INTERVIEW"] ?? 0) + (statusMap["FINAL_ROUND"] ?? 0);
  const offers = statusMap["OFFER"] ?? 0;
  const rejections = statusMap["REJECTED"] ?? 0;

  // Success rate: of applications that reached a final outcome (offer or
  // rejection), what fraction were offers? Applications still in progress
  // don't count toward the denominator, since they haven't resolved yet.
  const resolvedCount = offers + rejections;
  const successRate = resolvedCount > 0 ? Math.round((offers / resolvedCount) * 100) : 0;

  return {
    totalApplications,
    applicationsThisWeek,
    applicationsThisMonth,
    interviewsScheduled,
    offers,
    rejections,
    successRate,
    statusBreakdown: statusMap,
    recentApplications,
    upcomingDeadlines,
    upcomingInterviews,
  };
}