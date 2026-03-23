import { Link } from 'react-router-dom';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/formatters';
import type { Product } from '@/types';
import clsx from 'clsx';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className={clsx(
        'card group flex flex-col hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/30',
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-slate-800">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded-md">
            Featured
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-slate-900/80 px-3 py-1.5 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs text-brand-400 font-medium mb-1">{product.brand}</p>
        <h3 className="text-sm font-semibold text-white leading-snug mb-2 line-clamp-2 group-hover:text-brand-300 transition-colors">
          {product.name}
        </h3>

        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <StarIcon className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs text-slate-400">{product.rating.toFixed(1)}</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-lg font-bold text-white">{formatPrice(product.price)}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={clsx(
              'p-2 rounded-lg transition-colors duration-200',
              product.stock === 0
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 text-white'
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCartIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
