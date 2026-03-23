import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '@/components/ui/ProductCard';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types';

const mockProduct: Product = {
  id: 'prod_1',
  name: 'Damascus Chef Knife',
  slug: 'damascus-chef-knife',
  description: 'A premium knife',
  price: '189.99',
  category: 'Chef Knives',
  brand: 'BladeCraft',
  imageUrl: 'https://example.com/knife.jpg',
  stock: 5,
  featured: true,
  rating: 4.8,
  createdAt: new Date().toISOString(),
};

beforeEach(() => {
  useCartStore.getState().clearCart();
});

const renderCard = (product = mockProduct) =>
  render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  );

describe('ProductCard', () => {
  it('renders product name', () => {
    renderCard();
    expect(screen.getByText('Damascus Chef Knife')).toBeInTheDocument();
  });

  it('renders product price', () => {
    renderCard();
    expect(screen.getByText('$189.99')).toBeInTheDocument();
  });

  it('shows Featured badge for featured products', () => {
    renderCard();
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('does not show Featured badge for non-featured products', () => {
    renderCard({ ...mockProduct, featured: false });
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });

  it('shows Out of Stock when stock is 0', () => {
    renderCard({ ...mockProduct, stock: 0 });
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('adds item to cart when add button is clicked', () => {
    renderCard();
    const addBtn = screen.getByRole('button', { name: /add damascus chef knife to cart/i });
    fireEvent.click(addBtn);
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it('disables add button when out of stock', () => {
    renderCard({ ...mockProduct, stock: 0 });
    const addBtn = screen.getByRole('button', { name: /add damascus chef knife to cart/i });
    expect(addBtn).toBeDisabled();
  });

  it('links to product detail page', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/damascus-chef-knife');
  });
});

// Suppress unused import warning for vi
void vi;
