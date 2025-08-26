# Nike Shoes Shop — Step‑by‑Step Setup & Stack Suggestions

> Goal: Build a clean, fast, mobile‑first e‑commerce app focused on Nike shoes (catalog, variants by size/color, cart, checkout, orders, admin).

---

## 0) TL;DR — Pick Your Stack

**Track A (Modern JS, my default):**

* **Next.js (App Router) + TypeScript + Tailwind** for UI
* **PostgreSQL** (Neon) + **Prisma** ORM
* **NextAuth** for auth (Email/Google/Credentials)
* **Stripe** for payments (test mode first)
* **Cloudinary** (or UploadThing) for product images
* **Zustand** for cart state, **Zod + React Hook Form** for forms
* **Vercel** for deployment

---

## 1) Feature Scope

### MVP

* Home with featured shoes, search & filters (size, price, category)
* Product Listing Page (PLP) with pagination, sorting
* Product Detail Page (PDP) with images, size/variant selection, live stock
* Cart (guest + logged‑in persistence)
* Checkout (Stripe), orders, order confirmation email
* Admin: CRUD for products, variants, inventory, orders

### v2+ Ideas

* Wishlist, reviews/ratings, coupons, featured collections
* Inventory webhooks, low‑stock alerts
* SEO schema, sitemaps, server‑side search (Meilisearch/Algolia)
* Analytics dashboard (orders, revenue, top SKUs)

---

## 2) Data Model (both tracks)

**Entities**

* `User` (role: customer | admin)
* `Product` (name, slug, description, brand, images, active)
* `Variant` (productId, sku, color, size, price, compareAtPrice, stock)
* `Cart` (userId or anonymous token)
* `CartItem` (cartId, variantId, qty)
* `Order` (userId, status, subtotal, shipping, total, paymentRef)
* `OrderItem` (orderId, variantId, sku, name, unitPrice, qty)
* `Address` (userId, type: shipping/billing)
* `Coupon` (code, type, amount/percent, start/end, usageLimit)
* `Review` (userId, productId, rating, comment, approved)

> Notes: Keep **stock** at Variant level. Use **soft deletes (active flag)** for safe unpublishing. Index `slug`, `sku`, and search columns.

---

## 3) Track A — Next.js + TS + Tailwind + Prisma + Stripe

### Prereqs

* Node 18+ and PNPM/NPM, Git, a Postgres database (Neon is great), Stripe account (test mode), Cloudinary account (optional).

### 3.1 Bootstrap project

```bash
npx create-next-app@latest nike-shop \
  --ts --eslint --tailwind --app --src-dir --import-alias "@/*"
cd nike-shop

# deps
npm i @prisma/client prisma \
  next-auth @auth/prisma-adapter \
  zod react-hook-form \
  zustand \
  stripe @stripe/stripe-js @stripe/react-stripe-js \
  clsx

# (optional uploads)
npm i cloudinary
# OR npm i uploadthing @uploadthing/react
```

### 3.2 Environment variables (`.env.local`)

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_long_random_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_DEFAULT=price_... # optional per-variant pricing handled in code

# Cloudinary (optional)
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

### 3.3 Prisma init & schema

```bash
npx prisma init
```

`prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String?
  email     String?  @unique
  image     String?
  role      Role     @default(CUSTOMER)
  accounts  Account[]
  sessions  Session[]
  carts     Cart[]
  orders    Order[]
  addresses Address[]
  reviews   Review[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role { ADMIN CUSTOMER }

model Product {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String
  brand       String    @default("Nike")
  images      String[]
  active      Boolean   @default(true)
  variants    Variant[]
  reviews     Review[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Variant {
  id          String   @id @default(cuid())
  product     Product  @relation(fields: [productId], references: [id])
  productId   String
  sku         String   @unique
  color       String
  size        String
  price       Int      // cents
  compareAt   Int?
  stock       Int      @default(0)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Cart {
  id        String     @id @default(cuid())
  user      User?      @relation(fields: [userId], references: [id])
  userId    String?
  anonToken String?    @unique
  items     CartItem[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String  @id @default(cuid())
  cart      Cart    @relation(fields: [cartId], references: [id])
  cartId    String
  variant   Variant @relation(fields: [variantId], references: [id])
  variantId String
  qty       Int     @default(1)
}

model Order {
  id         String      @id @default(cuid())
  user       User?       @relation(fields: [userId], references: [id])
  userId     String?
  status     OrderStatus @default(PENDING)
  subtotal   Int
  shipping   Int         @default(0)
  total      Int
  paymentRef String?
  items      OrderItem[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

enum OrderStatus { PENDING PAID FULFILLED CANCELED REFUNDED }

model OrderItem {
  id        String  @id @default(cuid())
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   String
  variant   Variant @relation(fields: [variantId], references: [id])
  variantId String
  sku       String
  name      String
  unitPrice Int
  qty       Int
}

model Address {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  type      AddressType @default(SHIPPING)
  line1     String
  line2     String?
  city      String
  region    String
  postal    String
  country   String @default("PH")
}

enum AddressType { SHIPPING BILLING }

model Review {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  product   Product  @relation(fields: [productId], references: [id])
  productId String
  rating    Int
  comment   String
  approved  Boolean  @default(false)
  createdAt DateTime @default(now())
}

/// NextAuth models
model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String? @db.Text
  access_token       String? @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String? @db.Text
  session_state      String?
  user               User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

Run migrations:

```bash
npx prisma migrate dev --name init
npx prisma db seed  # (create a seed script first)
```

### 3.4 App structure (App Router)

```
src/
  app/
    (storefront)/
      layout.tsx
      page.tsx                # Home
      products/
        page.tsx              # PLP
      product/[slug]/page.tsx # PDP
      cart/page.tsx
      checkout/page.tsx
      orders/[id]/page.tsx
    admin/
      layout.tsx
      products/page.tsx
      products/new/page.tsx
      orders/page.tsx
    api/
      products/route.ts       # GET list, POST create (admin)
      cart/route.ts           # GET/POST cart for anon/auth
      cart/items/route.ts     # POST add/remove
      checkout/route.ts       # POST create Stripe session
      stripe/webhook/route.ts # POST webhook
  lib/
  components/
  styles/
```

### 3.5 Auth (NextAuth)

* Configure providers (Email/Google) and Prisma adapter.
* Guard admin routes by `role === 'ADMIN'`.

### 3.6 Cart & Checkout

* Use Zustand for client cart; persist to DB when user logs in.
* Server Route `/api/checkout` creates Stripe Checkout Session with line items from variants.
* Webhook updates `Order.status` to `PAID`.

### 3.7 Admin Panel

* Basic CRUD pages using shadcn/ui DataTable.
* CSV import for products/variants (optional).
* Stock adjustments write to `Variant.stock`.

### 3.8 Images

* Upload to Cloudinary via server action or API route; store returned URLs in `Product.images`.

### 3.9 Testing & Quality

* Lint + typecheck: `npm run lint`, `npm run typecheck`
* Unit: Vitest. E2E: Playwright (checkout happy path).

### 3.10 Deployment

* Push to GitHub → Vercel import
* Set env vars on Vercel (DB/Stripe/NextAuth/Cloudinary)
* Neon/PG: create prod DB; run migrations via `npx prisma migrate deploy`
* Stripe: add prod webhook to `/api/stripe/webhook`

---

## 5) UI/UX Checklist

* **Branding:** neutral palette; avoid official Nike logos unless licensed. Add a clear “Unofficial fan shop” note if relevant.
* **Home:** hero banner, featured collections (Air Force 1, Air Max, Jordan), best sellers grid.
* **PLP:** filters (size, color, price range), sort (newest, price asc/desc), quick add to cart.
* **PDP:** gallery with thumbnails, size chart, variant selector, stock indicator, delivery/return info.
* **Cart:** slide‑over mini cart + full cart page; discount code box (v2).
* **Checkout:** address form, order summary, Stripe drop‑in (Checkout or Elements).
* **Account:** orders list, order detail, saved addresses.
* **Admin:** product/variant CRUD, image manager, inventory adjustments, order status updates.

---

## 6) Legal & Compliance Notes

* Do **not** use Nike trademarks/logos or official imagery without permission.
* Make terms/privacy pages. Cookie consent if using analytics.
* Refund/return policy and contact info on PDP/checkout.

---

## 7) Performance & SEO

* Next.js: `next/image`, route segment caching, ISR for PLP/PDP; metadata and OpenGraph tags.
* Schema.org Product + Offer JSON‑LD on PDP.
* Image optimization (WebP/AVIF), lazy loading.

---



