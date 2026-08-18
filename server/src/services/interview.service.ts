import prisma from "../lib/prisma";
import type { CreateInterviewInput, UpdateInterviewInput } from "../validators/interview.validators";

export class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
  }
}

// Every interview operation first confirms the parent application belongs
// to this user — interviews have no userId of their own, so ownership is
// always checked via the application they're attached to.
async function assertApplicationOwnership(userId: string, applicationId: string) {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId },
  });
  if (!application) throw new NotFoundError("Application not found");
}

export async function createInterview(userId: string, applicationId: string, input: CreateInterviewInput) {
  await assertApplicationOwnership(userId, applicationId);

  return prisma.interview.create({
    data: { ...input, applicationId },
  });
}

export async function updateInterview(userId: string, interviewId: string, input: UpdateInterviewInput) {
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: { application: true },
  });
  if (!interview || interview.application.userId !== userId) {
    throw new NotFoundError("Interview not found");
  }

  return prisma.interview.update({
    where: { id: interviewId },
    data: input,
  });
}

export async function deleteInterview(userId: string, interviewId: string) {
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: { application: true },
  });
  if (!interview || interview.application.userId !== userId) {
    throw new NotFoundError("Interview not found");
  }

  await prisma.interview.delete({ where: { id: interviewId } });
}