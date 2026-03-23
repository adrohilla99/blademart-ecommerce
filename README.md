# BladeMart

A full-stack e-commerce project for knife products, built with React, Node.js, Prisma, PostgreSQL, and Stripe.

## Features

- Product catalog with search, filter, sort, and pagination
- JWT authentication (register, login, protected routes)
- Cart state management with persistence
- Stripe Checkout session creation
- Order history and order detail pages
- Backend validation with Zod
- Prisma ORM with PostgreSQL

## Tech Stack

### Frontend

- React 18 + Vite
- TypeScript
- Tailwind CSS
- React Router
- Zustand
- Axios
- Vitest + React Testing Library

### Backend

- Node.js + Express
- TypeScript
- Prisma
- PostgreSQL
- Zod
- JWT + bcryptjs
- Stripe SDK
- Jest + Supertest

## Repository Structure

```text
BladeMart/
├─ client/                # Frontend app (Vite + React)
├─ server/                # Backend API (Express + Prisma)
├─ docs/                  # Additional docs (deployment, workflow)
├─ package.json           # Workspace scripts
└─ README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL database (local or hosted)
- Stripe account (free test mode)

## Local Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment files

Backend env:

- Copy `server/.env.example` to `server/.env`
- Set real values for:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `STRIPE_SECRET_KEY` (must be a real `sk_test_...` key)
  - `CLIENT_URL`

Frontend env:

- Copy `client/.env.example` to `client/.env`
- Set `VITE_API_URL` (usually `http://localhost:5000/api`)

### 3. Run database migration and seed

```bash
npm run db:migrate
npm run db:seed
```

### 4. Start the app

```bash
npm run dev
```

Default local URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

## Stripe Setup (Free Test Mode)

Stripe test mode is free and does not charge real money.

1. Create or log in to a Stripe account.
2. Enable Test mode in Stripe Dashboard.
3. Go to Developers -> API keys.
4. Copy your Secret key (`sk_test_...`).
5. Put it in `server/.env` as `STRIPE_SECRET_KEY`.

Optional local webhook testing with Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/checkout/webhook
```

Then copy the shown `whsec_...` value into `STRIPE_WEBHOOK_SECRET` in `server/.env`.

## Scripts

From workspace root:

- `npm run dev` - Run client and server in dev mode
- `npm run build` - Build client and server
- `npm run test` - Run all tests
- `npm run lint` - Lint client and server
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:seed` - Seed demo data
- `npm run db:studio` - Open Prisma Studio

## API Summary

Base URL (local): `http://localhost:5000/api`

- Auth
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /auth/me`
- Products
  - `GET /products`
  - `GET /products/categories`
  - `GET /products/:slug`
- Checkout
  - `POST /checkout/create-session`
  - `GET /checkout/verify/:sessionId`
  - `POST /checkout/webhook`
- Orders
  - `GET /orders`
  - `GET /orders/:id`
- Health
  - `GET /health`

## Common Issues

### Invalid API Key provided: sk_test_...

Cause: `STRIPE_SECRET_KEY` is placeholder or invalid.

Fix:

1. Replace with a real Stripe test key from Dashboard.
2. Restart the backend server.

### Old product data/images still showing

Cause: database has old seeded data.

Fix:

```bash
npm run db:seed
```

Then hard-refresh browser.

## Tests

Run all tests:

```bash
npm run test
```

Backend tests are in `server/src/tests`.
Frontend tests are in `client/src/tests`.

## Deployment

Use the deployment guide in `docs/DEPLOYMENT.md`.

Suggested free-tier stack:

- Frontend: Vercel
- Backend: Render
- Database: Neon
- Payments: Stripe

## License

MIT License. See `LICENSE`.
