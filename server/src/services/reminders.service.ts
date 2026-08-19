import prisma from "../lib/prisma";
import type { ApplicationStatus } from "@prisma/client";

// Statuses where an application is "done" — no further action is expected,
// so a passed deadline on one of these isn't something to flag as overdue.
const TERMINAL_STATUSES: ApplicationStatus[] = ["OFFER", "REJECTED", "WITHDRAWN"];

export async function getReminders(userId: string) {
  const now = new Date();

  const [overdueDeadlines, upcomingDeadlines, upcomingInterviews] = await Promise.all([
    prisma.application.findMany({
      where: {
        userId,
        deadline: { lt: now },
        status: { notIn: TERMINAL_STATUSES },
      },
      orderBy: { deadline: "asc" },
    }),

    prisma.application.findMany({
      where: {
        userId,
        deadline: { gte: now },
      },
      orderBy: { deadline: "asc" },
    }),

    prisma.interview.findMany({
      where: {
        application: { userId },
        scheduledAt: { gte: now },
      },
      orderBy: { scheduledAt: "asc" },
      include: { application: { select: { id: true, company: true, jobTitle: true } } },
    }),
  ]);

  // Merge deadlines and interviews into one chronological "what's coming up"
  // list, tagged by type so the frontend can render each appropriately.
  const upcoming = [
    ...upcomingDeadlines.map((app) => ({
      type: "deadline" as const,
      date: app.deadline!,
      application: { id: app.id, company: app.company, jobTitle: app.jobTitle },
    })),
    ...upcomingInterviews.map((interview) => ({
      type: "interview" as const,
      date: interview.scheduledAt,
      round: interview.round,
      application: interview.application,
    })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  return {
    overdue: overdueDeadlines.map((app) => ({
      id: app.id,
      company: app.company,
      jobTitle: app.jobTitle,
      deadline: app.deadline!,
      status: app.status,
    })),
    upcoming,
  };
}