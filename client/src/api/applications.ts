import { apiClient } from "./client";
import type { Application, ApplicationInput } from "../types/application";

export async function fetchApplications(): Promise<Application[]> {
  const { data } = await apiClient.get<Application[]>("/applications");
  return data;
}

export async function fetchApplication(id: string): Promise<Application> {
  const { data } = await apiClient.get<Application>(`/applications/${id}`);
  return data;
}

export async function createApplication(input: ApplicationInput): Promise<Application> {
  const { data } = await apiClient.post<Application>("/applications", input);
  return data;
}

export async function updateApplication(id: string, input: ApplicationInput): Promise<Application> {
  const { data } = await apiClient.patch<Application>(`/applications/${id}`, input);
  return data;
}

export async function deleteApplication(id: string): Promise<void> {
  await apiClient.delete(`/applications/${id}`);
}