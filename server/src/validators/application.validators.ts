import { z } from "zod";

const workModeEnum = z.enum(["REMOTE", "HYBRID", "ONSITE"]);
const employmentTypeEnum = z.enum(["INTERNSHIP", "FULL_TIME", "PART_TIME", "CONTRACT"]);
const statusEnum = z.enum([
  "SAVED",
  "APPLIED",
  "ONLINE_ASSESSMENT",
  "INTERVIEW",
  "FINAL_ROUND",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
]);

// Fields shared by create/update. Optional fields use .nullable() too, since
// the frontend may explicitly send `null` to clear a previously-set value.
const baseApplicationFields = {
  company: z.string().min(1, "Company is required").max(200),
  jobTitle: z.string().min(1, "Job title is required").max(200),
  jobUrl: z.string().url("Must be a valid URL").nullable().optional(),
  location: z.string().max(200).nullable().optional(),
  workMode: workModeEnum.nullable().optional(),
  employmentType: employmentTypeEnum.nullable().optional(),
  status: statusEnum.optional(),
  source: z.string().max(100).nullable().optional(),
  salary: z.string().max(100).nullable().optional(),
  applicationDate: z.coerce.date().nullable().optional(),
  deadline: z.coerce.date().nullable().optional(),
  resumeUsed: z.string().max(200).nullable().optional(),
  coverLetterUsed: z.string().max(200).nullable().optional(),
  recruiterName: z.string().max(200).nullable().optional(),
  recruiterEmail: z.string().email("Invalid email").nullable().optional().or(z.literal("")),
  notes: z.string().nullable().optional(),
};

export const createApplicationSchema = z.object(baseApplicationFields);

export const updateApplicationSchema = z.object(baseApplicationFields).partial();

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;