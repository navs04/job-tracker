import { apiClient } from "./client";
import type { Interview } from "../types/application";

export interface InterviewInput {
  round: string;
  scheduledAt: string;
  type: string;
  interviewer?: string | null;
  meetingLink?: string | null;
  notes?: string | null;
  outcome?: string;
}

export async function createInterview(applicationId: string, input: InterviewInput): Promise<Interview> {
  const { data } = await apiClient.post<Interview>(`/applications/${applicationId}/interviews`, input);
  return data;
}

export async function updateInterview(id: string, input: Partial<InterviewInput>): Promise<Interview> {
  const { data } = await apiClient.patch<Interview>(`/interviews/${id}`, input);
  return data;
}

export async function deleteInterview(id: string): Promise<void> {
  await apiClient.delete(`/interviews/${id}`);
}