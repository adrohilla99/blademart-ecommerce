export function formatPrice(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function getOrderStatusColor(status: string): string {
  const map: Record<string, string> = {
    PAID: 'bg-green-900/40 text-green-400 border border-green-800',
    PENDING: 'bg-yellow-900/40 text-yellow-400 border border-yellow-800',
    FAILED: 'bg-red-900/40 text-red-400 border border-red-800',
    CANCELLED: 'bg-slate-800 text-slate-400 border border-slate-700',
    REFUNDED: 'bg-blue-900/40 text-blue-400 border border-blue-800',
  };
  return map[status] ?? 'bg-slate-800 text-slate-400';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '\u2026';
}
