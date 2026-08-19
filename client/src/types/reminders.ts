export interface OverdueDeadline {
  id: string;
  company: string;
  jobTitle: string;
  deadline: string;
  status: string;
}

export interface UpcomingItem {
  type: "deadline" | "interview";
  date: string;
  round?: string;
  application: { id: string; company: string; jobTitle: string };
}

export interface RemindersSummary {
  overdue: OverdueDeadline[];
  upcoming: UpcomingItem[];
}