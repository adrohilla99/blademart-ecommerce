import { useEffect, useState } from 'react';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import OrderCard from '@/components/ui/OrderCard';
import EmptyState from '@/components/ui/EmptyState';
import { getOrdersApi } from '@/api/orders.api';
import type { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrdersApi()
      .then(setOrders)
      .catch((e) => setError(e?.response?.data?.message ?? 'Failed to load orders'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="section-title mb-8">Order History</h1>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/3 mb-3" />
              <div className="h-3 bg-slate-800 rounded w-1/2 mb-4" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="w-10 h-10 bg-slate-800 rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center py-10 text-red-400">{error}</div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <EmptyState
          icon={<ClipboardDocumentListIcon className="w-16 h-16" />}
          title="No orders yet"
          description="Complete a purchase to see your order history here."
          action={{ label: 'Start Shopping', to: '/products' }}
        />
      )}

      {!isLoading && !error && orders.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
