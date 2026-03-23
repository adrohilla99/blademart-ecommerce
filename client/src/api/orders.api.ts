import api from './axios';
import type { ApiResponse, Order } from '@/types';

export async function getOrdersApi(): Promise<Order[]> {
  const res = await api.get<ApiResponse<Order[]>>('/orders');
  return res.data.data;
}

export async function getOrderByIdApi(id: string): Promise<Order> {
  const res = await api.get<ApiResponse<Order>>(`/orders/${id}`);
  return res.data.data;
}
