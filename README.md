# BladeMart — Full-Stack E-Commerce Platform

[![CI](https://github.com/adrohilla99/blademart-ecommerce/actions/workflows/ci.yml/badge.svg)](https://github.com/adrohilla99/blademart-ecommerce/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

> **A production-quality, full-stack e-commerce platform** built with React, Node.js, Stripe, and PostgreSQL. Features authentication, product catalog with search/filter, cart management, Stripe checkout, and order history.

---

## 🔗 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | [https://blademart-ecommerce.vercel.app](https://blademart-ecommerce.vercel.app) |
| **Backend API** | [https://blademart-api.onrender.com/api/health](https://blademart-api.onrender.com/api/health) |
| **GitHub Repo** | [https://github.com/adrohilla99/blademart-ecommerce](https://github.com/adrohilla99/blademart-ecommerce) |

> **Demo credentials:**
> - Email: `demo@blademart.com`
> - Password: `Demo1234!`
>
> **Stripe test card:** `4242 4242 4242 4242` · Expiry: any future date · CVC: any 3 digits

---

## 📸 Screenshots

| Homepage | Products | Cart | Order History |
|----------|----------|------|---------------|
| *(hero, featured products, category cards)* | *(search, filter, sort, grid)* | *(items, order summary, Stripe redirect)* | *(order list, detail view)* |

---

## ✨ Features

- **Product Catalog** — 12 seeded premium knife products with search, category filter, sort, and pagination
- **Authentication** — JWT-based registration/login, protected routes, persistent session
- **Shopping Cart** — Zustand + localStorage persistence, stock-aware quantity controls
- **Stripe Checkout** — Server-side session creation, price validation, test mode
- **Order History** — Authenticated users can view full order history and item details
- **Responsive UI** — Dark-themed, mobile-first design built with Tailwind CSS
- **CI Pipeline** — GitHub Actions: lint + test + build on every push/PR
- **Type Safety** — Full TypeScript coverage on both frontend and backend

---

## 🛠 Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 + Vite | UI framework + fast builds |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| React Router v6 | Client-side routing |
| Zustand | Lightweight state management |
| Axios | HTTP client with JWT interceptors |
| React Hot Toast | Toast notifications |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + Express | HTTP server |
| TypeScript | Type safety |
| Prisma ORM | Database access with migrations |
| PostgreSQL | Relational database |
| Zod | Request validation |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Stripe SDK | Payment processing |
| Helmet + Morgan | Security headers + logging |
| express-rate-limit | Rate limiting |

### Infrastructure
| Tool | Purpose |
|------|---------|
| Vercel | Frontend hosting (free) |
| Render | Backend hosting (free) |
| Neon | PostgreSQL database (free tier) |
| GitHub Actions | CI/CD pipeline |

---

## 🏗 Architecture

```mermaid
graph TD
    subgraph Client ["Client (Vercel)"]
        A[React + Vite + TypeScript]
        B[Zustand Store<br/>auth + cart]
        C[Axios API Layer]
    end

    subgraph Server ["Server (Render)"]
        D[Express + TypeScript]
        E[JWT Auth Middleware]
        F[Zod Validation]
        G[Controllers]
        H[Services]
    end

    subgraph Data ["Data Layer"]
        I[(PostgreSQL<br/>Neon)]
        J[Prisma ORM]
    end

    subgraph Stripe ["Stripe"]
        K[Checkout Sessions API]
        L[Webhooks]
    end

    A -->|HTTP + Bearer token| D
    C --> D
    D --> E --> G
    G --> H
    H --> J --> I
    H -->|create session| K
    K -->|redirect| A
    L -->|webhook event| D
    D -->|fulfill order| H
```

### Monorepo Structure

```
blademart-ecommerce/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── api/                # Axios API functions
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   └── ui/             # ProductCard, CartItemRow, OrderCard, etc.
│   │   ├── hooks/              # useProducts, useAuth
│   │   ├── layouts/            # MainLayout
│   │   ├── pages/              # Route page components
│   │   ├── routes/             # ProtectedRoute, GuestRoute
│   │   ├── store/              # Zustand stores (auth, cart)
│   │   ├── tests/              # Vitest + RTL tests
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # formatters
│   ├── vercel.json
│   └── .env.example
├── server/                     # Express + Prisma backend
│   ├── prisma/
│   │   ├── schema.prisma       # DB schema with migrations
│   │   └── seed.ts             # Demo users + products
│   ├── src/
│   │   ├── config/             # env, database, stripe
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # auth, error, validate
│   │   ├── routes/             # Express routers
│   │   ├── services/           # Business logic
│   │   ├── tests/              # Jest + Supertest tests
│   │   ├── utils/              # response helpers, jwt
│   │   ├── validators/         # Zod schemas
│   │   ├── app.ts              # Express app factory
│   │   └── server.ts           # Bootstrap entrypoint
│   ├── render.yaml
│   └── .env.example
├── docs/
├── .gitignore
├── LICENSE
├── package.json                # Root workspace scripts
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL (local or [Neon free tier](https://neon.tech))

### 1. Clone the repository

```bash
git clone https://github.com/adrohilla99/blademart-ecommerce.git
cd blademart-ecommerce
```

### 2. Install all dependencies

```bash
npm run install:all
```

### 3. Configure environment variables

**Backend:**
```bash
cp server/.env.example server/.env
```
Edit `server/.env`:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/blademart"
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...   # From Stripe dashboard (test mode)
STRIPE_WEBHOOK_SECRET=whsec_... # From Stripe CLI or dashboard
CLIENT_URL=http://localhost:5173
```

**Frontend:**
```bash
cp client/.env.example client/.env
```
Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=BladeMart
```

### 4. Set up the database

```bash
# Run Prisma migrations
npm run db:migrate

# Seed demo users and products
npm run db:seed
```

### 5. Start the development servers

```bash
npm run dev
```

This starts:
- Backend: [http://localhost:5000](http://localhost:5000)
- Frontend: [http://localhost:5173](http://localhost:5173)

---

## 📦 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run build` | Build both for production |
| `npm run test` | Run all tests |
| `npm run lint` | Lint both workspaces |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

---

## 🔌 API Reference

All responses follow the shape: `{ success: boolean, data: T, message?: string }`

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | — | Register new user |
| `POST` | `/api/auth/login` | — | Login and get JWT |
| `GET` | `/api/auth/me` | ✓ | Get current user |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/products` | — | List products (search, category, sort, page, limit) |
| `GET` | `/api/products/categories` | — | Get all categories |
| `GET` | `/api/products/:slug` | — | Get single product by slug |

### Checkout

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/checkout/create-session` | ✓ | Create Stripe checkout session |
| `GET` | `/api/checkout/verify/:sessionId` | ✓ | Verify and fulfill a session |
| `POST` | `/api/checkout/webhook` | — | Stripe webhook receiver |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/orders` | ✓ | List authenticated user's orders |
| `GET` | `/api/orders/:id` | ✓ | Get order detail |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |

---

## 💳 Stripe Test Mode

This application runs entirely in **Stripe test mode**. No real charges are made.

**Test card numbers:**

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |

Use any future expiry date (e.g., `12/34`) and any 3-digit CVC.

### Stripe Webhook (local development)

To test the webhook locally, install the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
# Forward events to your local server
stripe listen --forward-to localhost:5000/api/checkout/webhook

# Copy the webhook signing secret to server/.env
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🧪 Testing

### Run all tests

```bash
npm run test
```

### Backend tests (Jest + Supertest)

```bash
cd server
npm test
npm run test:coverage
```

Tests cover:
- `auth.test.ts` — register, login, /me endpoint, token validation
- `products.test.ts` — list, filter, search, sort, pagination, slug lookup
- `orders.test.ts` — authenticated order list and detail retrieval
- `health.test.ts` — health check and 404 handler

### Frontend tests (Vitest + React Testing Library)

```bash
cd client
npm test
npm run test:coverage
```

Tests cover:
- `cartStore.test.ts` — all cart store operations
- `ProductCard.test.tsx` — render, interaction, out-of-stock state
- `authStore.test.ts` — setAuth/logout cycle
- `formatters.test.ts` — price/date formatting utilities

---

## ☁️ Deployment

### Database — Neon (Free PostgreSQL)

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project → copy the connection string
3. Use the connection string as `DATABASE_URL` in both Render and locally

### Backend — Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repository
4. Set **Root Directory** to `server`
5. Build command: `npm ci && npx prisma generate && npx prisma migrate deploy && npm run build`
6. Start command: `node dist/server.js`
7. Add environment variables:
   - `NODE_ENV=production`
   - `DATABASE_URL` — your Neon connection string
   - `JWT_SECRET` — a strong random secret
   - `STRIPE_SECRET_KEY` — from Stripe dashboard (test mode)
   - `STRIPE_WEBHOOK_SECRET` — from Stripe webhook settings
   - `CLIENT_URL` — your Vercel frontend URL

### Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Set **Root Directory** to `client`
4. Framework preset: **Vite**
5. Add environment variables:
   - `VITE_API_URL` — your Render backend URL + `/api`
   - `VITE_APP_NAME=BladeMart`
6. Deploy

### Stripe Webhook (Production)

1. In Stripe Dashboard → Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://your-render-url.onrender.com/api/checkout/webhook`
3. Events to listen for: `checkout.session.completed`
4. Copy the signing secret → add as `STRIPE_WEBHOOK_SECRET` on Render

---

## 🌿 Git Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready, protected |
| `develop` | Integration branch for features |
| `feature/repo-hardening` | Root config, .gitignore, .gitattributes, workspace scripts, CI |
| `feature/backend-verification` | Prisma schema, Express app, auth, products, checkout, orders |
| `feature/frontend-verification` | Vite app, Zustand stores, API layer, all UI pages/components |
| `feature/checkout-order-flow` | Stripe success/cancel pages, order history and detail pages |

---

## ⚙️ Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `development` / `production` / `test` |
| `PORT` | No | Server port (default: 5000) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Min 32 chars, keep secret |
| `JWT_EXPIRES_IN` | No | Token expiry (default: `7d`) |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | No | Required for webhook verification |
| `CLIENT_URL` | Yes | Frontend URL for CORS + Stripe redirects |

### Client (`client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API URL |
| `VITE_APP_NAME` | No | App display name |

---

## 🔒 Security Notes

- **JWT tokens** are stored in Zustand persisted state (localStorage). For even higher security in production, consider httpOnly cookies.
- **Stripe prices** are validated server-side — clients send only `productId + quantity`, never prices.
- **Password hashing** uses bcrypt with 12 salt rounds.
- **Rate limiting** is applied globally (200 req/15min) and more strictly on auth routes (20 req/15min).
- **Helmet** sets secure HTTP headers including Content-Security-Policy.
- **CORS** is configured to allow only the `CLIENT_URL` origin.
- Input validation via **Zod** on all API endpoints.
- `.env` files are in `.gitignore` — never commit secrets.

---

## 🗺 Data Model

```
User (1) ─────── (N) Order (1) ─────── (N) OrderItem (N) ────── (1) Product
```

| Model | Key Fields |
|-------|-----------|
| `User` | id, name, email, passwordHash, role, createdAt |
| `Product` | id, name, slug, price, category, brand, imageUrl, stock, featured |
| `Order` | id, userId, status, totalAmount, stripeSessionId, createdAt |
| `OrderItem` | id, orderId, productId, quantity, unitPrice |

---

## 🚧 Known Limitations & Tradeoffs

| Limitation | Explanation |
|-----------|-------------|
| No refresh tokens | Using a single long-lived JWT for simplicity. Production should use short-lived access + refresh token rotation. |
| Cart in localStorage | Cart is not synced to backend for logged-in users. Cart resets after logout. |
| No webhook in dev | Webhook fulfillment requires Stripe CLI locally. The `/verify` endpoint provides a fallback for the success page. |
| Render cold starts | Free Render tier spins down after inactivity. First request may take ~30s. |
| No image upload | Product images use Unsplash URLs. Production would use S3/Cloudinary. |

---

## 🔮 Future Improvements

- [ ] Product reviews and ratings
- [ ] User profile page with password change
- [ ] Admin dashboard (product CRUD, order management)
- [ ] Email notifications (order confirmation, shipping updates)
- [ ] Wishlist / saved items
- [ ] Product image gallery (multiple images per product)
- [ ] Discount codes and promotions
- [ ] Inventory webhooks and real-time stock updates
- [ ] Redis caching for product queries
- [ ] Dockerized development environment
- [ ] OpenAPI/Swagger documentation
- [ ] PWA support
- [ ] Internationalization (i18n)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ as a portfolio project · <a href="https://github.com/adrohilla99/blademart-ecommerce">View on GitHub</a></p>
