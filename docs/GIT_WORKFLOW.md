# BladeMart — Git Branch Workflow

## Branch Strategy

This project follows a **GitFlow-inspired** branching model.

```
main          ← production-ready, protected
  └── develop ← integration branch
        ├── feature/project-setup
        ├── feature/backend-foundation
        ├── feature/authentication
        ├── feature/product-catalog
        ├── feature/cart
        ├── feature/stripe-checkout
        ├── feature/orders-history
        ├── feature/ui-polish
        ├── feature/testing-ci
        └── chore/documentation
```

---

## Suggested Commit Sequence

Run these commands to replicate a professional commit history:

```bash
# ─────────────────────────────────────────────
# SETUP
# ─────────────────────────────────────────────
git init
git branch -M main
git checkout -b develop

git checkout -b feature/project-setup
git add .gitignore package.json LICENSE README.md
git commit -m "chore(setup): initialize monorepo with root configs and license"
git checkout develop
git merge feature/project-setup --no-ff -m "merge: feature/project-setup"

# ─────────────────────────────────────────────
# BACKEND FOUNDATION
# ─────────────────────────────────────────────
git checkout -b feature/backend-foundation
git add server/package.json server/tsconfig.json server/.eslintrc.json server/.env.example server/jest.config.js
git add server/src/app.ts server/src/server.ts
git add server/src/config/
git add server/src/middleware/
git add server/src/utils/
git commit -m "feat(server): bootstrap Express app with middleware stack, env validation, and error handling"
git add server/prisma/
git commit -m "feat(db): add Prisma schema with User, Product, Order, OrderItem models and seed data"
git checkout develop
git merge feature/backend-foundation --no-ff -m "merge: feature/backend-foundation"

# ─────────────────────────────────────────────
# AUTHENTICATION
# ─────────────────────────────────────────────
git checkout -b feature/authentication
git add server/src/validators/auth.validator.ts
git add server/src/services/auth.service.ts
git add server/src/controllers/auth.controller.ts
git add server/src/routes/auth.routes.ts
git commit -m "feat(auth): add JWT-based registration, login, and /me endpoint with bcrypt hashing"
git add server/src/tests/auth.test.ts
git commit -m "test(auth): add coverage for register, login, protected routes, and invalid inputs"
git checkout develop
git merge feature/authentication --no-ff -m "merge: feature/authentication"

# ─────────────────────────────────────────────
# PRODUCT CATALOG
# ─────────────────────────────────────────────
git checkout -b feature/product-catalog
git add server/src/validators/product.validator.ts
git add server/src/services/product.service.ts
git add server/src/controllers/product.controller.ts
git add server/src/routes/product.routes.ts
git commit -m "feat(products): add paginated product listing with search, filter, sort, and slug lookup"
git add server/src/tests/products.test.ts
git commit -m "test(products): add coverage for product list, filters, search, and 404 handling"
git checkout develop
git merge feature/product-catalog --no-ff -m "merge: feature/product-catalog"

# ─────────────────────────────────────────────
# CLIENT FOUNDATION
# ─────────────────────────────────────────────
git checkout -b feature/cart
git add client/package.json client/tsconfig.json client/vite.config.ts client/tailwind.config.ts client/postcss.config.js client/index.html
git add client/src/main.tsx client/src/App.tsx client/src/index.css
git add client/src/types/ client/src/api/ client/src/store/ client/src/utils/ client/src/hooks/
git commit -m "feat(client): scaffold React+Vite+TypeScript app with Axios API layer, Zustand stores, and Tailwind"
git add client/src/layouts/ client/src/routes/ client/src/components/
git commit -m "feat(ui): add MainLayout, Navbar, Footer, ProtectedRoute, and reusable UI components"
git add client/src/pages/CartPage.tsx client/src/store/cartStore.ts
git commit -m "feat(cart): implement persistent cart with localStorage, stock limits, quantity controls"
git checkout develop
git merge feature/cart --no-ff -m "merge: feature/cart"

# ─────────────────────────────────────────────
# STRIPE CHECKOUT
# ─────────────────────────────────────────────
git checkout -b feature/stripe-checkout
git add server/src/config/stripe.ts
git add server/src/validators/checkout.validator.ts
git add server/src/services/checkout.service.ts
git add server/src/controllers/checkout.controller.ts
git add server/src/routes/checkout.routes.ts
git commit -m "feat(checkout): integrate Stripe checkout session creation with server-side price validation"
git add client/src/api/checkout.api.ts
git add client/src/pages/CheckoutSuccessPage.tsx client/src/pages/CheckoutCancelPage.tsx
git commit -m "feat(checkout): add client checkout flow, success page with session verification, and cancel page"
git checkout develop
git merge feature/stripe-checkout --no-ff -m "merge: feature/stripe-checkout"

# ─────────────────────────────────────────────
# ORDERS
# ─────────────────────────────────────────────
git checkout -b feature/orders-history
git add server/src/services/order.service.ts
git add server/src/controllers/order.controller.ts
git add server/src/routes/order.routes.ts
git commit -m "feat(orders): add order history and order detail endpoints for authenticated users"
git add server/src/tests/orders.test.ts
git commit -m "test(orders): add coverage for order list, detail, and auth guards"
git add client/src/api/orders.api.ts
git add client/src/pages/OrdersPage.tsx client/src/pages/OrderDetailPage.tsx
git add client/src/components/ui/OrderCard.tsx
git commit -m "feat(orders): add order history dashboard and order detail page with line items"
git checkout develop
git merge feature/orders-history --no-ff -m "merge: feature/orders-history"

# ─────────────────────────────────────────────
# PAGES & UI POLISH
# ─────────────────────────────────────────────
git checkout -b feature/ui-polish
git add client/src/pages/HomePage.tsx client/src/pages/ProductsPage.tsx
git add client/src/pages/ProductDetailPage.tsx
git add client/src/pages/LoginPage.tsx client/src/pages/RegisterPage.tsx
git add client/src/pages/NotFoundPage.tsx
git commit -m "feat(ui): add homepage with hero/featured/categories, products page with filters, auth forms, 404"
git checkout develop
git merge feature/ui-polish --no-ff -m "merge: feature/ui-polish"

# ─────────────────────────────────────────────
# TESTING + CI
# ─────────────────────────────────────────────
git checkout -b feature/testing-ci
git add client/src/tests/
git commit -m "test(client): add Vitest tests for cart store, auth store, ProductCard, and formatters"
git add .github/workflows/ci.yml
git commit -m "chore(ci): add GitHub Actions CI with lint, test, and build jobs for server and client"
git checkout develop
git merge feature/testing-ci --no-ff -m "merge: feature/testing-ci"

# ─────────────────────────────────────────────
# DOCUMENTATION & DEPLOYMENT
# ─────────────────────────────────────────────
git checkout -b chore/documentation
git add README.md docs/ server/render.yaml client/vercel.json
git commit -m "docs(readme): add comprehensive README with architecture diagram, API reference, and deployment guide"
git checkout develop
git merge chore/documentation --no-ff -m "merge: chore/documentation"

# ─────────────────────────────────────────────
# RELEASE TO MAIN
# ─────────────────────────────────────────────
git checkout main
git merge develop --no-ff -m "release: v1.0.0 — full-stack BladeMart e-commerce platform"
git tag -a v1.0.0 -m "v1.0.0: BladeMart initial release"
git push origin main develop --tags
```

---

## Hotfix Process

```bash
# Create hotfix from main
git checkout main
git checkout -b hotfix/fix-description

# Make fix, commit
git commit -m "fix(scope): describe what was fixed"

# Merge back to both main and develop
git checkout main
git merge hotfix/fix-description --no-ff
git tag -a v1.0.1 -m "v1.0.1: hotfix description"

git checkout develop
git merge hotfix/fix-description --no-ff

git branch -d hotfix/fix-description
```
