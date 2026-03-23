import api from './axios';
import type { ApiResponse } from '@/types';

export interface CheckoutSession {
  url: string;
  sessionId: string;
}

export async function createCheckoutSessionApi(
  items: Array<{ productId: string; quantity: number }>
): Promise<CheckoutSession> {
  const res = await api.post<ApiResponse<CheckoutSession>>('/checkout/create-session', { items });
  return res.data.data;
}

export async function verifySessionApi(sessionId: string): Promise<{ alreadyFulfilled: boolean }> {
  const res = await api.get<ApiResponse<{ alreadyFulfilled: boolean }>>(
    `/checkout/verify/${sessionId}`
  );
  return res.data.data;
}
