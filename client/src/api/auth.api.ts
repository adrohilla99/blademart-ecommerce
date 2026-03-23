import api from './axios';
import type { ApiResponse, User } from '@/types';

export interface AuthPayload {
  token: string;
  user: User;
}

export async function registerApi(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthPayload> {
  const res = await api.post<ApiResponse<AuthPayload>>('/auth/register', data);
  return res.data.data;
}

export async function loginApi(data: {
  email: string;
  password: string;
}): Promise<AuthPayload> {
  const res = await api.post<ApiResponse<AuthPayload>>('/auth/login', data);
  return res.data.data;
}

export async function getMeApi(): Promise<User> {
  const res = await api.get<ApiResponse<User>>('/auth/me');
  return res.data.data;
}
