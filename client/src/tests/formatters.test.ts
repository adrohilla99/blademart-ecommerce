import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate, truncateText, getOrderStatusColor } from '@/utils/formatters';

describe('formatPrice', () => {
  it('formats a number to USD currency string', () => {
    expect(formatPrice(189.99)).toBe('$189.99');
    expect(formatPrice('49.00')).toBe('$49.00');
    expect(formatPrice(0)).toBe('$0.00');
  });
});

describe('formatDate', () => {
  it('formats ISO date string to readable format', () => {
    const result = formatDate('2024-01-15T10:00:00Z');
    expect(result).toContain('January');
    expect(result).toContain('2024');
  });
});

describe('truncateText', () => {
  it('truncates text exceeding maxLength', () => {
    const result = truncateText('This is a long text', 10);
    expect(result.length).toBeLessThanOrEqual(11); // includes ellipsis
    expect(result).toContain('\u2026');
  });

  it('does not truncate short text', () => {
    expect(truncateText('Short', 10)).toBe('Short');
  });
});

describe('getOrderStatusColor', () => {
  it('returns green class for PAID status', () => {
    expect(getOrderStatusColor('PAID')).toContain('green');
  });

  it('returns yellow class for PENDING status', () => {
    expect(getOrderStatusColor('PENDING')).toContain('yellow');
  });
});
