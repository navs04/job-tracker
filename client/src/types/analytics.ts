export interface AnalyticsSummary {
  applicationsOverTime: { month: string; count: number }[];
  applicationsByStatus: { status: string; count: number }[];
  applicationsBySource: { source: string; count: number }[];
  interviewConversionRate: number;
  offerConversionRate: number;
  funnel: { applied: number; interview: number; offer: number };
  mostSuccessfulSources: { source: string; total: number; offers: number; successRate: number }[];
}