import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/database';

const app = createApp();

let authToken: string;
let userId: string;
let productId: string;

beforeAll(async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany({ where: { user: { email: 'test_orders@example.com' } } });
  await prisma.user.deleteMany({ where: { email: 'test_orders@example.com' } });

  // Register user
  const res = await request(app).post('/api/auth/register').send({
    name: 'Order Test User',
    email: 'test_orders@example.com',
    password: 'Password123',
  });
  authToken = res.body.data.token;
  userId = res.body.data.user.id;

  // Create a product for tests
  const product = await prisma.product.create({
    data: {
      name: 'Test Order Product',
      slug: 'test-order-product-unique',
      description: 'Test product',
      price: 29.99,
      category: 'Test',
      brand: 'TestBrand',
      imageUrl: 'https://example.com/img.jpg',
      stock: 50,
    },
  });
  productId = product.id;

  // Create a test order
  await prisma.order.create({
    data: {
      userId,
      status: 'PAID',
      totalAmount: 29.99,
      stripeSessionId: 'cs_test_mock_session_id',
      items: {
        create: [{ productId, quantity: 1, unitPrice: 29.99 }],
      },
    },
  });
});

afterAll(async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany({ where: { user: { email: 'test_orders@example.com' } } });
  await prisma.product.deleteMany({ where: { slug: 'test-order-product-unique' } });
  await prisma.user.deleteMany({ where: { email: 'test_orders@example.com' } });
  await prisma.$disconnect();
});

describe('GET /api/orders', () => {
  it('returns user orders when authenticated', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].items).toBeDefined();
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/orders/:id', () => {
  let orderId: string;

  beforeAll(async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${authToken}`);
    orderId = res.body.data[0].id;
  });

  it('returns order detail', async () => {
    const res = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(orderId);
    expect(res.body.data.items.length).toBeGreaterThan(0);
    expect(res.body.data.items[0].product).toBeDefined();
  });

  it('returns 404 for another user order', async () => {
    const res = await request(app)
      .get('/api/orders/nonexistent-order-id-xyz')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(404);
  });
});
