export default function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-square bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-800 rounded w-1/2" />
        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <div className="h-5 bg-slate-800 rounded w-16" />
          <div className="h-8 w-8 bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
