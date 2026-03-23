import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCartIcon, StarIcon, ChevronLeftIcon, CheckIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { getProductBySlugApi } from '@/api/products.api';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/formatters';
import type { Product } from '@/types';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    getProductBySlugApi(slug)
      .then(setProduct)
      .catch((e) => setError(e?.response?.data?.message ?? 'Product not found'))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, qty);
    toast.success(`${product.name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-slate-800 rounded-xl" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-800 rounded w-1/4" />
            <div className="h-8 bg-slate-800 rounded w-3/4" />
            <div className="h-6 bg-slate-800 rounded w-1/3" />
            <div className="space-y-2 mt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-slate-800 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <p className="text-red-400 text-lg mb-4">{error ?? 'Product not found'}</p>
        <Link to="/products" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <Link to="/products" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
        <ChevronLeftIcon className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-900 border border-slate-800">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.featured && (
            <span className="absolute top-4 left-4 bg-brand-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
              Featured
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <p className="text-brand-400 font-semibold mb-2">{product.brand}</p>
          <h1 className="text-3xl font-black text-white leading-tight mb-3">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            {product.rating && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(product.rating!) ? 'text-yellow-400' : 'text-slate-700'}`}
                  />
                ))}
                <span className="text-sm text-slate-400 ml-1">{product.rating.toFixed(1)}</span>
              </div>
            )}
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-md">{product.category}</span>
          </div>

          <p className="text-4xl font-black text-white mb-6">{formatPrice(product.price)}</p>

          <p className="text-slate-400 leading-relaxed mb-6">{product.description}</p>

          <div className="mb-6">
            {product.stock > 0 ? (
              <p className="text-sm text-green-400 flex items-center gap-1.5">
                <CheckIcon className="w-4 h-4" />
                In Stock ({product.stock} available)
              </p>
            ) : (
              <p className="text-sm text-red-400">Out of Stock</p>
            )}
          </div>

          {/* Quantity + Cart */}
          {product.stock > 0 && (
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="text-slate-400 hover:text-white transition-colors font-bold text-lg w-5"
                >
                  &minus;
                </button>
                <span className="text-white font-bold w-6 text-center">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="text-slate-400 hover:text-white transition-colors font-bold text-lg w-5"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-base transition-all ${
                  added
                    ? 'bg-green-700 text-white'
                    : 'bg-brand-600 hover:bg-brand-700 text-white'
                }`}
              >
                {added ? (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCartIcon className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
