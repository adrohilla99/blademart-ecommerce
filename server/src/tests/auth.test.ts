import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/database';

const app = createApp();

beforeAll(async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany({ where: { email: { contains: 'test_auth_' } } });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { contains: 'test_auth_' } } });
  await prisma.$disconnect();
});

describe('POST /api/auth/register', () => {
  const validUser = {
    name: 'Test User',
    email: 'test_auth_register@example.com',
    password: 'Password123',
  };

  it('registers a new user and returns token', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(validUser.email);
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it('rejects duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rejects invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, email: 'not-an-email' });
    expect(res.status).toBe(422);
  });

  it('rejects weak password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, email: 'test_auth_weak@example.com', password: 'weak' });
    expect(res.status).toBe(422);
  });

  it('rejects short name', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, email: 'test_auth_name@example.com', name: 'A' });
    expect(res.status).toBe(422);
  });
});

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login Test',
      email: 'test_auth_login@example.com',
      password: 'Password123',
    });
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test_auth_login@example.com',
      password: 'Password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test_auth_login@example.com',
      password: 'WrongPassword123',
    });
    expect(res.status).toBe(401);
  });

  it('rejects non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nouser@example.com',
      password: 'Password123',
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Me User',
      email: 'test_auth_me@example.com',
      password: 'Password123',
    });
    token = res.body.data.token;
  });

  it('returns user profile with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('test_auth_me@example.com');
    expect(res.body.data.passwordHash).toBeUndefined();
  });

  it('rejects missing token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.token.here');
    expect(res.status).toBe(401);
  });
});
