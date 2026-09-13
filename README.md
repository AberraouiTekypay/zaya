# ZAYA — Everything your pet needs, in one place.
> *Votre animal. Un seul endroit. De meilleurs soins, chaque jour.*
> *كل ما يحتاجه حيوانك الأليف، في مكان واحد.*

ZAYA is a modern, modular pet-care technology platform built for pet owners, veterinary clinics, and pet merchants. Initially launching in **Morocco** (MAD currency, Casablanca / Rabat clinics, French & Arabic with complete RTL layout), ZAYA is architected for seamless future expansion across the GCC, Europe, and North Africa.

---

## The ZAYA Flywheel

ZAYA is not merely an NFC-tag company; the NFC/QR tag is the entry point into a continuous care and recurring commerce flywheel:

```
NFC / QR TAG
      ↓
PET PROFILE (Identity)
      ↓
OWNER RELATIONSHIP
      ↓
HEALTH / CARE RECORDS
      ↓
REMINDERS (Vaccines, Deworming, Flea/Tick)
      ↓
VET / SERVICE
      ↓
PRODUCT NEED (Nutrition, Hygiene, Health)
      ↓
E-COMMERCE MARKETPLACE
      ↓
ORDER & DELIVERY (Cathedis / Express Maroc)
      ↓
REORDER (1-Click Reassort)
      ↓
RECURRING SUBSCRIPTION (-5%)
      ↓
REPEAT
```

---

## 📚 Technical Documentation Suite

Comprehensive architecture, API specifications, data models, and guides are located in the [`docs/`](file:///C:/zaya/docs) directory:

- 🏛️ **[System Architecture (`docs/ARCHITECTURE.md`)](file:///C:/zaya/docs/ARCHITECTURE.md)**: Next.js App Router design, state management, RBAC, and resilient serverless fallbacks.
- 🔌 **[REST API Reference (`docs/API.md`)](file:///C:/zaya/docs/API.md)**: Specifications for all 15 endpoints (methods, parameters, JSON payloads, responses, curl examples).
- 🗄️ **[Data Models & Schema (`docs/DATA_MODELS.md`)](file:///C:/zaya/docs/DATA_MODELS.md)**: Full Prisma ERD, model definitions, relationships, and data classification tiers.
- 🇲🇦 **[Moroccan Localization (`docs/LOCALIZATION.md`)](file:///C:/zaya/docs/LOCALIZATION.md)**: MAD currency formatting, +212 WhatsApp integration, Arabic RTL layout, and GCC/EU expansion.
- 🛠️ **[Developer & DevOps Guide (`docs/DEVELOPER_GUIDE.md`)](file:///C:/zaya/docs/DEVELOPER_GUIDE.md)**: Local setup, environment variables, Vitest tests, seed execution, and Vercel deployment.

---

## Core Features & Modules

### 1. Digital Pet Identity & Connected Tags
- Every pet receives an unforgeable digital identity with species, breed, approximate age, color, microchip number, emergency contacts, and notes.
- Physical laser-engraved **ZAYA NFC + QR Code Tag** (IP68 waterproof).
- Fast public scan lookup at `/p/{secure-token}` with high-error-correction QR code generator.

### 2. Lost Pet Mode (🚨 Mode Animal Perdu)
- **If your pet gets lost, every second matters.**
- 1-click activation by the pet owner.
- When scanned, the public page flashes a high-visibility urgent emergency banner.
- Direct **Call Owner** and **WhatsApp Owner** action buttons with pre-filled localized messages and GPS coordinates.
- **Finder Notification Form**: any bystander can report finding the pet with their phone number and neighborhood without creating an account.
- **Strict Privacy Guarantee**: Owner home address and private medical documents are **never** exposed publicly.

### 3. Health & Preventive Care Book
- Official vaccinations tracking with batch numbers, administration date, and next due date.
- Deworming, flea/tick treatments, medications, and weight evolution curves.
- Automatic smart reminders scheduled whenever a health entry with a due date is registered.

### 4. Smart Reminders Engine
- Multi-channel notification architecture: In-App, Email, and WhatsApp-ready formatting (`https://wa.me/212...`).
- Tracks vaccines, flea/tick treatments, vet visits, grooming, and predicted food depletion.

### 5. E-Commerce Marketplace & Reorder Engine
- Product categories: Alimentation (Dry food, Wet food, Treats), Hygiène & Litières, Santé & Antiparasitaires, Accessoires & Médailles, Jouets.
- Product detail pages with:
  - One-time purchase
  - Recurring subscription (-5% discount) with custom intervals (every 2 weeks, 30 days, 60 days, 90 days).
- **1-Click Reorder Engine**: *"Répéter ma dernière commande"* instant renewal.
- Cart with subtotal in Moroccan Dirhams (MAD), delivery fee calculation (25 MAD, free delivery above 450 MAD).
- Moroccan checkout supporting **Paiement à la livraison (Cash on Delivery)** and **Carte bancaire marocaine (CMI 3D-Secure)**.

### 6. Multi-Portal Architecture & User Personas
- **Pet Owner App (`/app`)**: Dashboard with quick reorder alert, urgent reminders strip, and pet dossiers (`/app/pets/[id]`).
- **Veterinarian Portal (`/vet`)**: Clinic patients management, instant tag assignment, official vaccination logs.
- **Merchant Portal (`/merchant`)**: Product catalog management, prices in MAD, stock, sales GMV.
- **Central Admin Console (`/admin`)**: Platform metrics (owners, pets, active tags, lost pets, orders, GMV in MAD, active subscriptions), audit logs, and instant persona switching.

### 7. Modular Moroccan Localization & Internationalization
- Languages: **French** (default), **Arabic** (with proper RTL layout), **English**.
- Currency: **MAD (Moroccan Dirham / د.م.)**.
- Phone formatting: `+212` with Moroccan mobile and landline patterns.
- Addresses: Moroccan cities (Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès, Meknès).
- Modular architecture ready for GCC (AED, SAR), Europe (EUR), etc.

---

## Tech Stack

- **Frontend & App Router**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Lucide Icons
- **Database & ORM**: Prisma 7 ORM with SQLite driver adapter for zero-friction local execution, compatible with PostgreSQL
- **Testing**: Vitest with unit and integration tests
- **QR Engine**: `qrcode` SVG/Data URL generation

---

## Local Setup & Development

### 1. Prerequisites
- Node.js 20+ (tested on v22.15.0)
- npm 10+

### 2. Installation
```bash
git clone https://github.com/AberraouiTekypay/zaya.git
cd zaya
npm install
```

### 3. Database Initialization & Seed Data
```bash
# Push schema to SQLite database
npx prisma db push

# Seed realistic Moroccan test data (Amine, Sarah with lost Max, Dr. Bennani, Atlas Pet Shop, products in MAD)
npx tsx prisma/seed.ts
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Automated Test Suite

Run the Vitest test suite covering security sanitization, lost mode alerts, Moroccan pricing, and QR/WhatsApp generation:

```bash
npm test
```

Run ESLint:
```bash
npm run lint
```

Run production build:
```bash
npm run build
```

---

## Demo Personas & Test Credentials

The application provides an instant **Perspective Switcher** in the top navbar:

| Persona | Role | Location | Focus Flow |
|---|---|---|---|
| **Amine Berraoui** | Owner | Casablanca | Manages **Luna** (Cat, Tag `ZY-CAS-101`), Reorder Engine, Subscriptions |
| **Sarah El Fassi** | Owner | Rabat | Manages **Max** (German Shepherd, Tag `ZY-RAB-204`) — **🚨 LOST PET MODE ACTIVE** |
| **Dr. Youssef Bennani** | Vet | Casablanca | Clinique d'Anfa, patient vaccines, tag activation |
| **Atlas Pet Supply** | Merchant | Casablanca | Store inventory, prices in MAD, sales GMV |
| **Admin ZAYA** | Admin | Casablanca | Platform KPIs, security audit logs, global supervision |

---

## Public Scan Demonstrations (NFC / QR)

- **Normal Safe Pet**: [http://localhost:3000/p/luna_sec_7891](http://localhost:3000/p/luna_sec_7891)
- **Lost Pet Emergency Alert**: [http://localhost:3000/p/max_lost_demo_9921](http://localhost:3000/p/max_lost_demo_9921)

---

## Production Deployment & DNS Configuration

### Vercel Deployment
The application is pre-configured for Vercel deployment:
```bash
vercel deploy --prod
```

### DNS Configuration for `zaya.ma` and `www.zaya.ma`

To link your Moroccan domain `zaya.ma` to Vercel, configure the following DNS records at your Moroccan registrar (e.g., Genious, Cap Connect, MTDS):

| Type | Name / Host | Value / Target | TTL |
|---|---|---|---|
| **A** | `@` (or root) | `76.76.21.21` | 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com.` | 3600 |

*Note: For SSL certification, Vercel automatically provisions Let's Encrypt certificates once DNS propagation finishes.*

---

## Security Architecture

1. **Tag Token Obfuscation**: NFC tags contain only an opaque token (`/p/{secure-token}`). Internal database IDs and owner credentials are never exposed.
2. **Strict Public Data Sanitization**: The public scan endpoint strips owner address, private medical documents, and diagnostic notes.
3. **Audit Trails**: Security actions (Lost Mode toggled, tags scanned, orders placed) are logged in `AuditLog`.
4. **Environment Isolation**: Private credentials remain exclusively in `.env` and are excluded via `.gitignore`.

---

## License

© 2026 ZAYA Technologies SARL. Tous droits réservés.
