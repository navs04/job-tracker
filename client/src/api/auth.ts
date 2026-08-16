import { apiClient, setAccessToken } from "./client";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

export async function registerRequest(name: string, email: string, password: string) {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", { name, email, password });
  setAccessToken(data.accessToken);
  return data.user;
}

export async function loginRequest(email: string, password: string) {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  setAccessToken(data.accessToken);
  return data.user;
}

export async function logoutRequest() {
  await apiClient.post("/auth/logout");
  setAccessToken(null);
}

export async function refreshRequest() {
  const { data } = await apiClient.post<AuthResponse>("/auth/refresh");
  setAccessToken(data.accessToken);
  return data.user;
}