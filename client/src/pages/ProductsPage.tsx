import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ProductCard from '@/components/ui/ProductCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import EmptyState from '@/components/ui/EmptyState';
import { useProducts } from '@/hooks/useProducts';
import type { SortOption } from '@/types';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const {
    products, pagination, categories, filters,
    isLoading, error,
    setSearch, setCategory, setSort, setPage, resetFilters,
  } = useProducts();

  // Sync URL params on mount
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasActiveFilters = filters.search || filters.category || filters.sort !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">All Products</h1>
          {pagination && (
            <p className="text-sm text-slate-500 mt-1">
              {pagination.total} product{pagination.total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300">
            <XMarkIcon className="w-4 h-4" />
            Clear filters
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search knives, brands..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={filters.category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field pl-9 pr-4 min-w-[180px] appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="input-field min-w-[180px] appearance-none cursor-pointer"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Error state */}
      {error && (
        <div className="text-center py-10 text-red-400">
          <p>Failed to load products: {error}</p>
        </div>
      )}

      {/* Product Grid */}
      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && products.length === 0 && (
        <EmptyState
          title="No products found"
          description="Try adjusting your search or filters."
          action={{ label: 'Clear filters', to: '/products' }}
        />
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          <button
            onClick={() => setPage(filters.page - 1)}
            disabled={filters.page <= 1}
            className="btn-outline py-2 px-4 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setPage(page)}
              className={`py-2 px-4 text-sm rounded-lg font-medium transition-colors ${
                page === filters.page
                  ? 'bg-brand-600 text-white'
                  : 'btn-outline'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setPage(filters.page + 1)}
            disabled={filters.page >= pagination.totalPages}
            className="btn-outline py-2 px-4 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
