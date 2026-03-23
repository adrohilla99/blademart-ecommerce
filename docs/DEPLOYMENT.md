# BladeMart — Deployment Guide

Step-by-step guide to deploy BladeMart to production using free hosting services.

---

## Stack Overview

| Layer | Service | Free Tier |
|-------|---------|-----------|
| Frontend | Vercel | Unlimited hobby projects |
| Backend | Render | 750 hours/month (1 service free) |
| Database | Neon | 0.5 GB storage, 1 branch |

---

## Step 1: Create GitHub Repository

```bash
cd blademart-ecommerce

# Initialize git
git init
git branch -M main

# Create .gitignore is already set up

# Initial commit
git add .
git commit -m "feat: initial BladeMart project scaffold"

# Create repository on GitHub (via CLI or web)
gh repo create blademart-ecommerce \
  --public \
  --description "Full-stack e-commerce platform built with React, Node.js, Stripe, and PostgreSQL, featuring authentication, cart management, checkout, and order history."

# Push
git remote add origin https://github.com/YOUR_USERNAME/blademart-ecommerce.git
git push -u origin main

# Create develop branch
git checkout -b develop
git push -u origin develop
```

---

## Step 2: Neon PostgreSQL (Database)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Click **New Project** → name it `blademart`
3. Choose the closest region to your Render server
4. Copy the **Connection string** (it looks like):
   ```
   postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Save this — you'll need it for Render and local development

---

## Step 3: Stripe Setup

1. Go to [stripe.com](https://stripe.com) and create/login to your account
2. Make sure you are in **Test mode** (toggle in dashboard)
3. Go to **Developers → API Keys**
4. Copy your **Secret key** (`sk_test_...`)
5. For webhooks (set up after deploying backend):
   - Go to **Developers → Webhooks → Add endpoint**
   - Endpoint URL: `https://YOUR-RENDER-URL.onrender.com/api/checkout/webhook`
   - Select events: `checkout.session.completed`
   - Copy the **Signing secret** (`whsec_...`)

---

## Step 4: Deploy Backend to Render

1. Go to [render.com](https://render.com) and create a free account
2. Click **New → Web Service**
3. Connect your GitHub account and select `blademart-ecommerce`
4. Configure:
   - **Name**: `blademart-api`
   - **Root Directory**: `server`
   - **Build Command**: `npm ci && npx prisma generate && npx prisma migrate deploy && npm run build`
   - **Start Command**: `node dist/server.js`
   - **Instance Type**: Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<your-neon-connection-string>
   JWT_SECRET=<generate-a-strong-random-secret>
   JWT_EXPIRES_IN=7d
   STRIPE_SECRET_KEY=sk_test_<your-stripe-secret-key>
   STRIPE_WEBHOOK_SECRET=<after-step-3-webhook-setup>
   CLIENT_URL=<your-vercel-frontend-url>  # Add after Step 5
   ```

6. Click **Create Web Service**
7. Wait for the first deploy. Once live, test:
   ```
   curl https://blademart-api.onrender.com/api/health
   ```

8. **Seed the database:**
   In Render dashboard → Shell tab:
   ```bash
   npx tsx prisma/seed.ts
   ```
   Or run locally pointing to production DB:
   ```bash
   DATABASE_URL=<neon-url> npm run db:seed
   ```

---

## Step 5: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and create a free account
2. Click **Add New → Project**
3. Import your `blademart-ecommerce` GitHub repository
4. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   ```
   VITE_API_URL=https://blademart-api.onrender.com/api
   VITE_APP_NAME=BladeMart
   ```

6. Click **Deploy**
7. Once live, copy your Vercel URL (e.g., `https://blademart-ecommerce.vercel.app`)

---

## Step 6: Update Cross-Origin Settings

1. **Update Render** `CLIENT_URL` env var to your Vercel URL
2. **Redeploy** the Render service (or it will redeploy automatically on next push)

---

## Step 7: Configure Stripe Webhook (Production)

1. Go back to Stripe Dashboard → Developers → Webhooks
2. The endpoint URL should be: `https://blademart-api.onrender.com/api/checkout/webhook`
3. If not already done, click **Add Endpoint**, set it up, copy the `whsec_...` signing secret
4. Update `STRIPE_WEBHOOK_SECRET` in Render environment variables

---

## Step 8: Verify Everything Works

Run through this checklist:

- [ ] `GET https://blademart-api.onrender.com/api/health` returns `{ status: "healthy" }`
- [ ] `GET https://blademart-api.onrender.com/api/products` returns product list
- [ ] Frontend loads at Vercel URL
- [ ] Can register a new account
- [ ] Can login with demo credentials (`demo@blademart.com` / `Demo1234!`)
- [ ] Products page loads with search and filter
- [ ] Can add products to cart
- [ ] Can initiate checkout (redirects to Stripe)
- [ ] Stripe test payment completes with card `4242 4242 4242 4242`
- [ ] Success page shows after payment
- [ ] Order appears in order history

---

## CI/CD Pipeline

GitHub Actions runs on every push to `main` and `develop`:

1. **Server Lint** — ESLint TypeScript check
2. **Server Build** — TypeScript compilation
3. **Server Tests** — Jest + Supertest with PostgreSQL service container
4. **Client Lint** — ESLint + TypeScript type-check
5. **Client Tests** — Vitest unit tests
6. **Client Build** — Vite production build

Vercel and Render both auto-deploy when `main` is updated.

---

## Generating a Secure JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

---

## Troubleshooting

**Render cold starts:** Free Render services spin down after 15 minutes of inactivity. The first request after sleeping may take 30–60 seconds. Consider using [UptimeRobot](https://uptimerobot.com) (free) to ping your health endpoint every 5 minutes.

**CORS errors:** Ensure `CLIENT_URL` on Render exactly matches your Vercel URL (no trailing slash).

**Prisma migration fails on deploy:** Make sure `DATABASE_URL` is correctly set and the Neon database is accessible from Render's region.

**Stripe webhook signature fails:** Ensure `STRIPE_WEBHOOK_SECRET` matches the signing secret from the Stripe dashboard for that specific endpoint.
