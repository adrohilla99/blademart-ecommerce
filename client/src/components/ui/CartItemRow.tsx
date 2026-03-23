import { Link } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/formatters';
import type { CartItem } from '@/types';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  return (
    <div className="flex gap-4 py-4 border-b border-slate-800 last:border-0">
      <Link to={`/products/${product.slug}`} className="shrink-0">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-lg bg-slate-800"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${product.slug}`}
          className="text-sm font-semibold text-white hover:text-brand-300 transition-colors line-clamp-2"
        >
          {product.name}
        </Link>
        <p className="text-xs text-slate-500 mt-0.5">{product.brand} &middot; {product.category}</p>
        <p className="text-sm font-bold text-brand-400 mt-1">{formatPrice(product.price)}</p>
      </div>

      <div className="flex flex-col items-end justify-between shrink-0">
        <button
          onClick={() => removeItem(product.id)}
          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
          aria-label="Remove item"
        >
          <TrashIcon className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-2 py-1">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            disabled={quantity <= 1}
            className="text-slate-400 hover:text-white transition-colors disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <MinusIcon className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm font-semibold text-white w-5 text-center">{quantity}</span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            disabled={quantity >= product.stock}
            className="text-slate-400 hover:text-white transition-colors disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <PlusIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-sm font-bold text-white">
          {formatPrice(parseFloat(product.price) * quantity)}
        </p>
      </div>
    </div>
  );
}
