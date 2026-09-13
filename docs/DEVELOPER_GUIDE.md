# ZAYA — Developer & DevOps Operations Guide

This guide provides step-by-step instructions for installing, developing, testing, and deploying the ZAYA platform.

---

## 1. Prerequisites

- **Node.js**: `v20.x` or `v22.x` (recommended `v22.15.0`)
- **npm**: `v10.x` or `v11.x`
- **Git**: Installed and configured
- **Operating System**: macOS, Linux, or Windows (PowerShell)

---

## 2. Environment Variables Configuration

Create a `.env` file in the project root:

```ini
# Database Connection String
# Local Development & Edge uses SQLite
DATABASE_URL="file:./dev.db"

# Production PostgreSQL (Supabase, Neon, or Railway)
# DATABASE_URL="postgresql://user:password@host:5432/zaya?sslmode=require"

# Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Moroccan Payment Gateway (CMI)
# CMI_STORE_KEY="test_store_key"
# CMI_CLIENT_ID="123456"

# Optional: WhatsApp Cloud API
# WHATSAPP_API_TOKEN="token_here"
```

---

## 3. Installation & Database Setup

```bash
# 1. Clone repository
git clone https://github.com/AberraouiTekypay/zaya.git
cd zaya

# 2. Install dependencies
npm install

# 3. Generate Prisma 7 Client
npx prisma generate

# 4. Push schema to SQLite database
npx prisma db push

# 5. Populate realistic Moroccan seed dataset
npx tsx prisma/seed.ts
```

---

## 4. Development Workflow

Start the Next.js Turbopack development server:

```bash
npm run dev
```

Visit the following key URLs in your browser:
- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Boutique & Marketplace**: [http://localhost:3000/boutique](http://localhost:3000/boutique) or [http://localhost:3000/shop](http://localhost:3000/shop)
- **Pet Owner Dashboard**: [http://localhost:3000/app](http://localhost:3000/app)
- **Luna's Digital Pet Dossier**: [http://localhost:3000/app/pets/pet_luna_casablanca](http://localhost:3000/app/pets/pet_luna_casablanca)
- **Public NFC Scan (Safe Pet)**: [http://localhost:3000/p/luna_sec_7891](http://localhost:3000/p/luna_sec_7891)
- **Public NFC Scan (🚨 Lost Pet Alert)**: [http://localhost:3000/p/max_lost_demo_9921](http://localhost:3000/p/max_lost_demo_9921)
- **Veterinary Practitioner Portal**: [http://localhost:3000/vet](http://localhost:3000/vet)
- **Merchant Inventory Portal**: [http://localhost:3000/merchant](http://localhost:3000/merchant)
- **Central Admin Console**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 5. Automated Testing Suite

ZAYA uses **Vitest** for fast unit and integration testing.

```bash
# Run all automated test suites
npm test

# Run tests in watch mode
npx vitest

# Check TypeScript typing and linting
npm run lint
```

### Test Coverage Summary:
- [`tests/security.test.ts`](file:///C:/zaya/tests/security.test.ts): Verifies PII stripping, address redaction, and WhatsApp URL formulation.
- [`tests/commerce.test.ts`](file:///C:/zaya/tests/commerce.test.ts): Verifies Moroccan delivery thresholds (25 MAD vs Free above 450 MAD), Cash on Delivery provider, and 5% recurring subscriber discounts.
- [`tests/reminders.test.ts`](file:///C:/zaya/tests/reminders.test.ts): Verifies smart reminders calculation for annual rabies boosters and flea pipettes.
- [`tests/data-service.test.ts`](file:///C:/zaya/tests/data-service.test.ts): Verifies resilient fallback mechanisms on cold serverless boots.

---

## 6. Production Build & Deployment

### Build Verification
Always run a production build locally before promoting:

```bash
npm run build
```

### Deploying to Vercel
Deploy to production using the Vercel CLI:

```bash
npx vercel --yes --prod
```

### Custom Domain Setup (`zaya.ma`)
In your domain registrar DNS management (e.g. Genious, Cap Connect, Maroc Telecom):
- Add `A` record pointing `@` to `76.76.21.21`.
- Add `CNAME` record pointing `www` to `cname.vercel-dns.com`.
- Vercel automatically requests and renews Let's Encrypt SSL/TLS certificates.
