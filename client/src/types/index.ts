export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  category: string;
  brand: string;
  imageUrl: string;
  stock: number;
  featured: boolean;
  rating: number | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export interface OrderItemDetail {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  product: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    category?: string;
    brand?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: string;
  stripeSessionId: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDetail[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedProducts {
  products: Product[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating';

export interface ProductFilters {
  search: string;
  category: string;
  sort: SortOption;
  page: number;
}
