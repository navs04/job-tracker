import { apiClient } from "./client";
import type { RemindersSummary } from "../types/reminders";

export async function fetchReminders(): Promise<RemindersSummary> {
  const { data } = await apiClient.get<RemindersSummary>("/reminders");
  return data;
}