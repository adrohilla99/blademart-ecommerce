import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ShieldCheckIcon, TruckIcon, StarIcon } from '@heroicons/react/24/outline';
import ProductCard from '@/components/ui/ProductCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { getFeaturedProductsApi } from '@/api/products.api';
import type { Product } from '@/types';

const CATEGORIES = [
  { name: 'Chef Knives', emoji: '🍳', desc: 'Professional kitchen blades' },
  { name: 'Folding Knives', emoji: '🔪', desc: 'EDC and tactical folders' },
  { name: 'Hunting Knives', emoji: '🏕️', desc: 'Field and survival blades' },
  { name: 'Accessories', emoji: '🛠️', desc: 'Sharpeners, storage & more' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFeaturedProductsApi()
      .then(setFeatured)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-950/30 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 bg-brand-950/40 border border-brand-900 px-3 py-1.5 rounded-full mb-6">
              <StarIcon className="w-3.5 h-3.5" />
              Premium Blades Since 2023
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Forged for{' '}
              <span className="text-brand-500">Perfection.</span>
              <br />
              Built to Last.
            </h1>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-xl">
              Discover our curated collection of premium chef knives, tactical folders, hunting
              blades, and accessories &mdash; crafted for those who demand the best.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
                Shop All Blades
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link to="/products?featured=true" className="btn-outline text-base px-8 py-3">
                Featured Collection
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { icon: ShieldCheckIcon, text: 'Secure Payments' },
                { icon: TruckIcon, text: 'Free Shipping $50+' },
                { icon: StarIcon, text: '5-Star Reviews' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-slate-400">
                  <Icon className="w-4 h-4 text-brand-500" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
            View all <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="card p-6 hover:border-brand-800 hover:bg-slate-900/80 transition-all group text-center"
            >
              <span className="text-4xl block mb-3">{cat.emoji}</span>
              <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/products" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
            See all <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featured.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-brand-900/40 via-brand-950/60 to-slate-900 border-y border-brand-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Ready to find your perfect blade?
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Browse our full collection. Free shipping on orders over $50. Test Stripe payments with card 4242 4242 4242 4242.
          </p>
          <Link to="/products" className="btn-primary text-base px-10 py-3">
            Browse Full Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
