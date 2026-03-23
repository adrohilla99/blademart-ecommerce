import { Link } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/outline';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="card p-10 animate-slide-up">
          <XCircleIcon className="w-20 h-20 text-slate-600 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-white mb-3">Checkout Cancelled</h1>
          <p className="text-slate-400 mb-8">
            Your payment was cancelled and you have not been charged. Your cart items are still
            saved if you want to try again.
          </p>

          <div className="flex flex-col gap-3">
            <Link to="/cart" className="btn-primary py-3">
              Return to Cart
            </Link>
            <Link to="/products" className="btn-outline py-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
