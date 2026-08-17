import { apiClient } from "./client";
import type {  Application, ApplicationInput, ApplicationStatus, WorkMode, EmploymentType } from "../types/application";

export interface ApplicationFilters {
  search?: string;
  status?: ApplicationStatus | "";
  workMode?: WorkMode | "";
  employmentType?: EmploymentType | "";
  location?: string;
  sortBy?: "createdAt" | "applicationDate" | "deadline" | "company";
  sortOrder?: "asc" | "desc";
}

export async function fetchApplications(filters: ApplicationFilters = {}): Promise<Application[]> {
  const params: Record<string, string> = {};
  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  if (filters.workMode) params.workMode = filters.workMode;
  if (filters.employmentType) params.employmentType = filters.employmentType;
  if (filters.location) params.location = filters.location;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;

  const { data } = await apiClient.get<Application[]>("/applications", { params });
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