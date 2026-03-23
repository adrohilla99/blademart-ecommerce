import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-xl font-black text-white">
              Blade<span className="text-brand-500">Mart</span>
            </span>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Premium blades and knives for chefs, collectors, and outdoor enthusiasts.
              Crafted for performance. Built to last.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Shop</h3>
            <ul className="mt-4 space-y-2">
              {['Chef Knives', 'Folding Knives', 'Hunting Knives', 'Accessories'].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Account</h3>
            <ul className="mt-4 space-y-2">
              {[
                { to: '/login', label: 'Login' },
                { to: '/register', label: 'Register' },
                { to: '/orders', label: 'Order History' },
                { to: '/cart', label: 'Shopping Cart' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} BladeMart. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Payments secured by{' '}
            <span className="text-slate-400 font-medium">Stripe</span> &middot; Test mode active
          </p>
        </div>
      </div>
    </footer>
  );
}
