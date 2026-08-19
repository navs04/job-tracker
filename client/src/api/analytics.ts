import { apiClient } from "./client";
import type { AnalyticsSummary } from "../types/analytics";

export async function fetchAnalytics(): Promise<AnalyticsSummary> {
  const { data } = await apiClient.get<AnalyticsSummary>("/analytics");
  return data;
}