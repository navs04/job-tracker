import { apiClient } from "./client";
import type { DashboardSummary } from "../types/application";

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>("/dashboard");
  return data;
}