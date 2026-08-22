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

export interface DashboardSummary {
  totalApplications: number;
  applicationsThisWeek: number;
  applicationsThisMonth: number;
  interviewsScheduled: number;
  offers: number;
  rejections: number;
  successRate: number;
  statusBreakdown: Partial<Record<ApplicationStatus, number>>;
  recentApplications: Application[];
  upcomingDeadlines: Application[];
  upcomingInterviews: (Interview & { application: { id: string; company: string; jobTitle: string } })[];
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

export const STATUS_STYLES: Record<ApplicationStatus, { text: string; bg: string }> = {
  SAVED: { text: "text-status-saved", bg: "bg-status-saved-bg" },
  APPLIED: { text: "text-status-applied", bg: "bg-status-applied-bg" },
  ONLINE_ASSESSMENT: { text: "text-status-assessment", bg: "bg-status-assessment-bg" },
  INTERVIEW: { text: "text-status-interview", bg: "bg-status-interview-bg" },
  FINAL_ROUND: { text: "text-status-final", bg: "bg-status-final-bg" },
  OFFER: { text: "text-status-offer", bg: "bg-status-offer-bg" },
  REJECTED: { text: "text-status-rejected", bg: "bg-status-rejected-bg" },
  WITHDRAWN: { text: "text-status-withdrawn", bg: "bg-status-withdrawn-bg" },
};