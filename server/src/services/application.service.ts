import prisma from "../lib/prisma";
import type { CreateApplicationInput, UpdateApplicationInput } from "../validators/application.validators";
import type { ApplicationStatus } from "@prisma/client";

export class NotFoundError extends Error {
  constructor(message = "Application not found") {
    super(message);
  }
}

export async function listApplications(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getApplication(userId: string, id: string) {
  const application = await prisma.application.findFirst({
    where: { id, userId },
    include: {
      interviews: { orderBy: { scheduledAt: "asc" } },
      statusHistory: { orderBy: { changedAt: "asc" } },
    },
  });
  if (!application) throw new NotFoundError();
  return application;
}

export async function createApplication(userId: string, input: CreateApplicationInput) {
  const application = await prisma.application.create({
    data: {
      ...input,
      userId,
      status: input.status ?? "SAVED",
    },
  });

  await prisma.statusHistoryEntry.create({
    data: {
      applicationId: application.id,
      fromStatus: null,
      toStatus: application.status,
    },
  });

  return application;
}

export async function updateApplication(userId: string, id: string, input: UpdateApplicationInput) {
  const existing = await prisma.application.findFirst({ where: { id, userId } });
  if (!existing) throw new NotFoundError();

  const application = await prisma.application.update({
    where: { id },
    data: input,
  });

  // Log a status transition only when the status actually changed
  if (input.status && input.status !== existing.status) {
    await prisma.statusHistoryEntry.create({
      data: {
        applicationId: id,
        fromStatus: existing.status,
        toStatus: input.status as ApplicationStatus,
      },
    });
  }

  return application;
}

export async function deleteApplication(userId: string, id: string) {
  const existing = await prisma.application.findFirst({ where: { id, userId } });
  if (!existing) throw new NotFoundError();

  await prisma.application.delete({ where: { id } });
}