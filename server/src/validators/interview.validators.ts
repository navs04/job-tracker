import { z } from "zod";

const interviewTypeEnum = z.enum([
  "PHONE_SCREEN",
  "TECHNICAL",
  "BEHAVIORAL",
  "SYSTEM_DESIGN",
  "ONSITE",
  "FINAL",
  "OTHER",
]);

const interviewOutcomeEnum = z.enum(["PENDING", "PASSED", "FAILED", "CANCELLED"]);

const baseInterviewFields = {
  round: z.string().min(1, "Round is required").max(100),
  scheduledAt: z.coerce.date(),
  type: interviewTypeEnum,
  interviewer: z.string().max(200).nullable().optional(),
  meetingLink: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
  notes: z.string().nullable().optional(),
  outcome: interviewOutcomeEnum.optional(),
};

export const createInterviewSchema = z.object(baseInterviewFields);
export const updateInterviewSchema = z.object(baseInterviewFields).partial();

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;