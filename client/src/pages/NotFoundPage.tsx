import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <p className="text-8xl font-black text-slate-800 mb-4">404</p>
        <h1 className="text-2xl font-black text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">Back to Home</Link>
          <Link to="/products" className="btn-outline">Browse Products</Link>
        </div>
      </div>
    </div>
  );
}
