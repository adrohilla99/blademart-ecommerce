import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { getOrderByIdApi } from '@/api/orders.api';
import { formatPrice, formatDate, getOrderStatusColor } from '@/utils/formatters';
import type { Order } from '@/types';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getOrderByIdApi(id)
      .then(setOrder)
      .catch((e) => setError(e?.response?.data?.message ?? 'Order not found'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse space-y-6">
        <div className="h-6 bg-slate-800 rounded w-1/3" />
        <div className="card p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-16 h-16 bg-slate-800 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-800 rounded w-2/3" />
                <div className="h-3 bg-slate-800 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-red-400 mb-4">{error ?? 'Order not found'}</p>
        <Link to="/orders" className="btn-primary">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <Link to="/orders" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
        <ChevronLeftIcon className="w-4 h-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">Order Details</h1>
          <p className="text-slate-500 font-mono text-sm mt-1">#{order.id.slice(-8).toUpperCase()}</p>
        </div>
        <span className={`badge text-sm ${getOrderStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* Meta */}
      <div className="card p-5 mb-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-slate-500">Order Date</p>
          <p className="text-white font-medium mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <div>
          <p className="text-slate-500">Total</p>
          <p className="text-white font-bold text-lg mt-0.5">{formatPrice(order.totalAmount)}</p>
        </div>
        {order.stripeSessionId && (
          <div>
            <p className="text-slate-500">Transaction</p>
            <p className="text-slate-400 font-mono text-xs mt-0.5 truncate">
              {order.stripeSessionId.slice(-16)}
            </p>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="card p-5">
        <h2 className="font-bold text-white mb-5">Items ({order.items.length})</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 py-4 border-b border-slate-800 last:border-0">
              <Link to={`/products/${item.product.slug}`}>
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg bg-slate-800"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.product.slug}`}
                  className="text-sm font-semibold text-white hover:text-brand-300 transition-colors"
                >
                  {item.product.name}
                </Link>
                <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity}</p>
                <p className="text-xs text-slate-500">Unit price: {formatPrice(item.unitPrice)}</p>
              </div>
              <div className="text-sm font-bold text-white shrink-0">
                {formatPrice(parseFloat(item.unitPrice) * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-base font-bold text-white">
          <span>Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
