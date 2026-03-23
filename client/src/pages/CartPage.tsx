import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import CartItemRow from '@/components/ui/CartItemRow';
import EmptyState from '@/components/ui/EmptyState';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { createCheckoutSessionApi } from '@/api/checkout.api';
import { formatPrice } from '@/utils/formatters';
import { useState } from 'react';

export default function CartPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to checkout');
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    setIsCheckingOut(true);
    try {
      const checkoutItems = items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      }));

      const { url } = await createCheckoutSessionApi(checkoutItems);
      clearCart();
      window.location.href = url; // Redirect to Stripe Checkout
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Checkout failed. Please try again.';
      toast.error(message);
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="section-title mb-8">Your Cart</h1>
        <EmptyState
          icon={<ShoppingBagIcon className="w-16 h-16" />}
          title="Your cart is empty"
          description="Browse our premium blade collection and add items to get started."
          action={{ label: 'Start Shopping', to: '/products' }}
        />
      </div>
    );
  }

  const tax = subtotal() * 0.08;
  const shipping = subtotal() >= 50 ? 0 : 9.99;
  const total = subtotal() + tax + shipping;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="section-title mb-8">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2">
          <div className="card p-4">
            {items.map((item) => (
              <CartItemRow key={item.product.id} item={item} />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="md:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="font-bold text-white text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal())}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between font-bold text-white text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-slate-500 mt-3 text-center">
                Add {formatPrice(50 - subtotal())} for free shipping
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="btn-primary w-full mt-5 py-3 text-base"
            >
              {isCheckingOut ? 'Redirecting to Stripe\u2026' : 'Proceed to Checkout'}
            </button>

            <Link
              to="/products"
              className="block text-center text-sm text-slate-400 hover:text-white mt-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
