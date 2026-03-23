import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types';

const mockProduct: Product = {
  id: 'prod_1',
  name: 'Damascus Chef Knife',
  slug: 'damascus-chef-knife',
  description: 'A test knife',
  price: '189.99',
  category: 'Chef Knives',
  brand: 'BladeCraft',
  imageUrl: 'https://example.com/knife.jpg',
  stock: 10,
  featured: true,
  rating: 4.8,
  createdAt: new Date().toISOString(),
};

beforeEach(() => {
  useCartStore.getState().clearCart();
});

describe('Cart Store', () => {
  it('adds a product to cart', () => {
    useCartStore.getState().addItem(mockProduct);
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe('prod_1');
    expect(items[0].quantity).toBe(1);
  });

  it('increases quantity when adding same product', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().addItem(mockProduct);
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('does not exceed stock limit', () => {
    for (let i = 0; i < 15; i++) {
      useCartStore.getState().addItem(mockProduct);
    }
    const items = useCartStore.getState().items;
    expect(items[0].quantity).toBe(mockProduct.stock);
  });

  it('removes an item from cart', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().removeItem('prod_1');
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('updates quantity', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().updateQuantity('prod_1', 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('removes item when quantity set to 0', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().updateQuantity('prod_1', 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('calculates item count correctly', () => {
    const product2 = { ...mockProduct, id: 'prod_2' };
    useCartStore.getState().addItem(mockProduct, 3);
    useCartStore.getState().addItem(product2, 2);
    expect(useCartStore.getState().itemCount()).toBe(5);
  });

  it('calculates subtotal correctly', () => {
    useCartStore.getState().addItem(mockProduct, 2);
    const expected = 189.99 * 2;
    expect(useCartStore.getState().subtotal()).toBeCloseTo(expected, 2);
  });

  it('clears cart', () => {
    useCartStore.getState().addItem(mockProduct, 3);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
