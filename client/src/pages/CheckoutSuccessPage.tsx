import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { verifySessionApi } from '@/api/checkout.api';
import { useAuthStore } from '@/store/authStore';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!sessionId || hasVerified.current) return;
    if (!isAuthenticated) {
      setStatus('success'); // Guest: just show success
      return;
    }

    hasVerified.current = true;
    verifySessionApi(sessionId)
      .then(() => setStatus('success'))
      .catch(() => setStatus('success')); // Even on error, Stripe webhook handles fulfillment
  }, [sessionId, isAuthenticated]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="card p-10 animate-slide-up">
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />

          {status === 'verifying' ? (
            <>
              <h1 className="text-2xl font-black text-white mb-3">Confirming your order&hellip;</h1>
              <p className="text-slate-400">Please wait while we verify your payment.</p>
              <div className="mt-6 flex justify-center">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black text-white mb-3">Payment Successful!</h1>
              <p className="text-slate-400 mb-8">
                Thank you for your order. Your blades are being prepared for shipment.
                {isAuthenticated && " You'll find your order details in your order history."}
              </p>

              <div className="flex flex-col gap-3">
                {isAuthenticated && (
                  <Link to="/orders" className="btn-primary py-3">
                    View Order History
                  </Link>
                )}
                <Link to="/products" className="btn-outline py-3">
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-6 p-4 bg-slate-800/60 rounded-lg text-left">
                <p className="text-xs text-slate-500 font-semibold mb-2">Test mode reminder</p>
                <p className="text-xs text-slate-500">
                  This transaction was processed in Stripe test mode. No real charges were made.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
