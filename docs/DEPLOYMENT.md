# BladeMart Deployment Guide

This guide explains how to deploy BladeMart using a free-tier stack:

- Frontend: Vercel
- Backend API: Render
- Database: Neon PostgreSQL
- Payments: Stripe (test mode or live mode)

## 1. Prerequisites

- A GitHub repository containing this project
- Accounts on Neon, Render, Vercel, and Stripe
- Node.js 18+ and npm 9+ for local checks

## 2. Recommended Architecture

- Frontend app hosted on Vercel (`client`)
- Backend API hosted on Render (`server`)
- Managed PostgreSQL hosted on Neon
- Stripe Checkout + webhook callbacks handled by backend API

## 3. Environment Variables

### Backend (`server`)

- `NODE_ENV=production`
- `PORT=10000`
- `DATABASE_URL=<neon-connection-string>`
- `JWT_SECRET=<strong-random-secret>`
- `JWT_EXPIRES_IN=7d`
- `STRIPE_SECRET_KEY=<sk_test_... or sk_live_...>`
- `STRIPE_WEBHOOK_SECRET=<whsec_...>`
- `CLIENT_URL=<frontend-url>`

### Frontend (`client`)

- `VITE_API_URL=<backend-url>/api`
- `VITE_APP_NAME=BladeMart`

## 4. Provision the Database (Neon)

1. Create a Neon project.
2. Copy the PostgreSQL connection string.
3. Save it for Render (`DATABASE_URL`).

Example format:

```text
postgresql://username:password@host/database?sslmode=require
```

## 5. Configure Stripe

1. Open Stripe Dashboard.
2. Enable Test mode for non-production testing.
3. Copy `sk_test_...` from Developers -> API keys.
4. Add webhook endpoint after backend deploy:
   - `https://<render-service>.onrender.com/api/checkout/webhook`
5. Subscribe to event:
   - `checkout.session.completed`
6. Copy signing secret `whsec_...`.

## 6. Deploy Backend on Render

### Option A: Using `server/render.yaml`

1. In Render, create a new Blueprint or Web Service from the repository.
2. Use `server` as root service folder.
3. Confirm build and start settings:
   - Build: `npm ci && npx prisma generate && npx prisma migrate deploy && npm run build`
   - Start: `node dist/server.js`
4. Set backend environment variables listed above.

### Option B: Manual Web Service Setup

Configure:

- Runtime: Node
- Root Directory: `server`
- Build Command: `npm ci && npx prisma generate && npx prisma migrate deploy && npm run build`
- Start Command: `node dist/server.js`
- Health Check Path: `/api/health`

## 7. Run Migrations and Seed Data

After first successful backend deploy:

1. Open Render shell for the backend service.
2. Run:

```bash
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

## 8. Deploy Frontend on Vercel

1. Import repository in Vercel.
2. Set project root to `client`.
3. Confirm Vite build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add frontend environment variables.
5. Deploy.

## 9. Connect Frontend and Backend

1. Set frontend `VITE_API_URL` to backend API URL.
2. Set backend `CLIENT_URL` to frontend URL.
3. Redeploy services if required.

## 10. Verification Checklist

- `GET /api/health` returns healthy status
- Product list loads in frontend
- Registration and login work
- Cart operations work
- Checkout session creation redirects to Stripe
- Test payment succeeds with Stripe test card
- Successful payment appears in order history

## 11. Useful Operational Notes

- Render free instances may cold start after inactivity.
- Keep `JWT_SECRET`, Stripe keys, and database credentials in platform secrets only.
- Do not commit `.env` files.
- For production traffic, rotate credentials regularly and monitor logs.

## 12. Troubleshooting

### CORS errors

- Ensure backend `CLIENT_URL` exactly matches frontend origin.

### Stripe signature failures

- Ensure `STRIPE_WEBHOOK_SECRET` belongs to the exact configured webhook endpoint.

### Migration errors

- Confirm `DATABASE_URL` is valid and reachable from Render.

### Empty product catalog

- Run seed command in deployed backend environment.
