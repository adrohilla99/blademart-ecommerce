import api from './axios';
import type { ApiResponse, PaginatedProducts, Product, ProductFilters } from '@/types';

export async function getProductsApi(filters: Partial<ProductFilters>): Promise<PaginatedProducts> {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page) params.set('page', String(filters.page));

  const res = await api.get<ApiResponse<PaginatedProducts>>(`/products?${params.toString()}`);
  return res.data.data;
}

export async function getProductBySlugApi(slug: string): Promise<Product> {
  const res = await api.get<ApiResponse<Product>>(`/products/${slug}`);
  return res.data.data;
}

export async function getCategoriesApi(): Promise<string[]> {
  const res = await api.get<ApiResponse<string[]>>('/products/categories');
  return res.data.data;
}

export async function getFeaturedProductsApi(): Promise<Product[]> {
  const res = await api.get<ApiResponse<PaginatedProducts>>('/products?featured=true&limit=8');
  return res.data.data.products;
}
