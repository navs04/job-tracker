export type WorkMode = "REMOTE" | "HYBRID" | "ONSITE";
export type EmploymentType = "INTERNSHIP" | "FULL_TIME" | "PART_TIME" | "CONTRACT";
export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "ONLINE_ASSESSMENT"
  | "INTERVIEW"
  | "FINAL_ROUND"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

export interface Application {
  id: string;
  company: string;
  jobTitle: string;
  jobUrl: string | null;
  location: string | null;
  workMode: WorkMode | null;
  employmentType: EmploymentType | null;
  status: ApplicationStatus;
  source: string | null;
  salary: string | null;
  applicationDate: string | null;
  deadline: string | null;
  resumeUsed: string | null;
  coverLetterUsed: string | null;
  recruiterName: string | null;
  recruiterEmail: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryEntry {
  id: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  changedAt: string;
}

export interface Interview {
  id: string;
  round: string;
  scheduledAt: string;
  type: string;
  interviewer: string | null;
  meetingLink: string | null;
  notes: string | null;
  outcome: string;
}

export interface ApplicationDetail extends Application {
  statusHistory: StatusHistoryEntry[];
  interviews: Interview[];
}

export type ApplicationInput = Partial<Omit<Application, "id" | "createdAt" | "updatedAt">>;

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  ONLINE_ASSESSMENT: "Online Assessment",
  INTERVIEW: "Interview",
  FINAL_ROUND: "Final Round",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};