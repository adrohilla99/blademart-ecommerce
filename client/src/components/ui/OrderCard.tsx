import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { formatPrice, formatDateShort, getOrderStatusColor } from '@/utils/formatters';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <Link
      to={`/orders/${order.id}`}
      className="card hover:border-slate-700 transition-colors block p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={`badge text-xs ${getOrderStatusColor(order.status)}`}>
              {order.status}
            </span>
            <span className="text-xs text-slate-500">{formatDateShort(order.createdAt)}</span>
          </div>
          <p className="text-xs text-slate-500 font-mono truncate">
            #{order.id.slice(-8).toUpperCase()}
          </p>
          <div className="flex items-center gap-2 mt-3">
            {order.items.slice(0, 3).map((item) => (
              <img
                key={item.id}
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-10 h-10 rounded-md object-cover bg-slate-800"
              />
            ))}
            {order.items.length > 3 && (
              <span className="text-xs text-slate-500">+{order.items.length - 3} more</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-lg font-bold text-white">{formatPrice(order.totalAmount)}</p>
            <p className="text-xs text-slate-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-slate-600" />
        </div>
      </div>
    </Link>
  );
}
