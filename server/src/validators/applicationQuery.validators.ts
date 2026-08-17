import { z } from "zod";

export const listApplicationsQuerySchema = z.object({
  search: z.string().max(200).optional(),
  status: z.enum([
    "SAVED", "APPLIED", "ONLINE_ASSESSMENT", "INTERVIEW",
    "FINAL_ROUND", "OFFER", "REJECTED", "WITHDRAWN",
  ]).optional(),
  workMode: z.enum(["REMOTE", "HYBRID", "ONSITE"]).optional(),
  employmentType: z.enum(["INTERNSHIP", "FULL_TIME", "PART_TIME", "CONTRACT"]).optional(),
  location: z.string().max(200).optional(),
  sortBy: z.enum(["createdAt", "applicationDate", "deadline", "company"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});