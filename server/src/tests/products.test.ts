import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/database';

const app = createApp();

beforeAll(async () => {
  await prisma.product.deleteMany({ where: { slug: { startsWith: 'test-product-' } } });

  await prisma.product.createMany({
    data: [
      {
        name: 'Test Chef Knife',
        slug: 'test-product-chef-knife',
        description: 'A test chef knife for testing',
        price: 99.99,
        category: 'Chef Knives',
        brand: 'TestBrand',
        imageUrl: 'https://example.com/image.jpg',
        stock: 10,
        featured: true,
      },
      {
        name: 'Test Folding Knife',
        slug: 'test-product-folding-knife',
        description: 'A test folding knife for testing',
        price: 49.99,
        category: 'Folding Knives',
        brand: 'TestBrand',
        imageUrl: 'https://example.com/image2.jpg',
        stock: 20,
        featured: false,
      },
    ],
  });
});

afterAll(async () => {
  await prisma.product.deleteMany({ where: { slug: { startsWith: 'test-product-' } } });
  await prisma.$disconnect();
});

describe('GET /api/products', () => {
  it('returns paginated products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.products).toBeInstanceOf(Array);
    expect(res.body.data.pagination).toBeDefined();
  });

  it('filters by category', async () => {
    const res = await request(app).get('/api/products?category=Chef+Knives');
    expect(res.status).toBe(200);
    res.body.data.products.forEach((p: { category: string }) => {
      expect(p.category.toLowerCase()).toContain('chef');
    });
  });

  it('searches by name', async () => {
    const res = await request(app).get('/api/products?search=folding');
    expect(res.status).toBe(200);
    expect(res.body.data.products.length).toBeGreaterThan(0);
  });

  it('filters featured products', async () => {
    const res = await request(app).get('/api/products?featured=true');
    expect(res.status).toBe(200);
    res.body.data.products.forEach((p: { featured: boolean }) => {
      expect(p.featured).toBe(true);
    });
  });

  it('sorts by price ascending', async () => {
    const res = await request(app).get('/api/products?sort=price_asc');
    expect(res.status).toBe(200);
    const prices = res.body.data.products.map((p: { price: string }) => parseFloat(p.price));
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  it('paginates correctly', async () => {
    const res = await request(app).get('/api/products?page=1&limit=1');
    expect(res.status).toBe(200);
    expect(res.body.data.products.length).toBeLessThanOrEqual(1);
    expect(res.body.data.pagination.limit).toBe(1);
  });
});

describe('GET /api/products/:slug', () => {
  it('returns a product by slug', async () => {
    const res = await request(app).get('/api/products/test-product-chef-knife');
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe('test-product-chef-knife');
    expect(res.body.data.price).toBeDefined();
  });

  it('returns 404 for unknown slug', async () => {
    const res = await request(app).get('/api/products/non-existent-slug-xyz');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/products/categories', () => {
  it('returns list of categories', async () => {
    const res = await request(app).get('/api/products/categories');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
