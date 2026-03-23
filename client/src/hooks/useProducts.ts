import { useState, useEffect, useCallback } from 'react';
import { getProductsApi, getCategoriesApi } from '@/api/products.api';
import type { Product, PaginationMeta, ProductFilters, SortOption } from '@/types';

interface UseProductsReturn {
  products: Product[];
  pagination: PaginationMeta | null;
  categories: string[];
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setSort: (sort: SortOption) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: ProductFilters = {
  search: '',
  category: '',
  sort: 'newest',
  page: 1,
};

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategoriesApi().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getProductsApi(filters)
      .then(({ products, pagination }) => {
        if (!cancelled) {
          setProducts(products);
          setPagination(pagination);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.response?.data?.message ?? 'Failed to load products');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  const setSearch = useCallback(
    (search: string) => setFilters((f) => ({ ...f, search, page: 1 })),
    []
  );
  const setCategory = useCallback(
    (category: string) => setFilters((f) => ({ ...f, category, page: 1 })),
    []
  );
  const setSort = useCallback(
    (sort: SortOption) => setFilters((f) => ({ ...f, sort, page: 1 })),
    []
  );
  const setPage = useCallback((page: number) => setFilters((f) => ({ ...f, page })), []);
  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return {
    products,
    pagination,
    categories,
    filters,
    isLoading,
    error,
    setSearch,
    setCategory,
    setSort,
    setPage,
    resetFilters,
  };
}
