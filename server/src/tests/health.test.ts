import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/database';

const app = createApp();

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /api/health', () => {
  it('returns healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
    expect(res.body.data.timestamp).toBeDefined();
  });
});

describe('404 handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route-xyz');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
