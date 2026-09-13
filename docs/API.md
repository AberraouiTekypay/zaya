# ZAYA — REST API Reference & Specification

This document details all 15 REST endpoints implemented in the ZAYA platform. All endpoints return standard JSON responses and follow conventional HTTP response codes.

---

## Table of Contents
1. [Pet Identity & Profiles (`/api/pets`)](#1-pet-identity--profiles)
2. [NFC & QR Tag Operations (`/api/tags`)](#2-nfc--qr-tag-operations)
3. [Emergency Lost Pet Protocol (`/api/finder-alert`, `/lost-mode`)](#3-emergency-lost-pet-protocol)
4. [E-Commerce Marketplace & Reorder (`/api/products`, `/api/orders`, `/api/reorder`)](#4-e-commerce-marketplace--reorder)
5. [Subscriptions (`/api/subscriptions`)](#5-subscriptions)
6. [Veterinary Clinical Management (`/api/vet/dashboard`)](#6-veterinary-clinical-management)
7. [Admin KPIs & Auditing (`/api/admin/metrics`)](#7-admin-kpis--auditing)

---

## 1. Pet Identity & Profiles

### `GET /api/pets`
Retrieve all pets owned by a specific user.

- **Query Parameters**:
  - `ownerId` *(optional, string)*: User ID of the owner. Defaults to `"usr_amine_owner"`.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "pets": [
      {
        "id": "pet_luna_casablanca",
        "name": "Luna",
        "species": "CAT",
        "breed": "British Shorthair",
        "birthDate": "2023-04-10T00:00:00.000Z",
        "sex": "FEMALE",
        "color": "Gris argenté / Silver Grey",
        "microchipNumber": "604098100234567",
        "photoUrl": "https://images.unsplash.com/...",
        "isLost": false,
        "tag": {
          "code": "ZY-CAS-101",
          "token": "luna_sec_7891",
          "status": "ACTIVE"
        },
        "reminders": [...],
        "healthRecords": [...]
      }
    ]
  }
  ```

### `POST /api/pets`
Register a new digital pet profile.

- **Request Body**:
  ```json
  {
    "ownerId": "usr_amine_owner",
    "name": "Nala",
    "species": "CAT",
    "breed": "Siamois",
    "birthDate": "2024-01-15",
    "sex": "FEMALE",
    "color": "Beige et brun",
    "microchipNumber": "604098100999111",
    "notes": "Chatte très affectueuse",
    "emergencyContact": "Karim",
    "emergencyPhone": "+212 661 99 88 77"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "pet": { "id": "pet_...", "name": "Nala", ... }
  }
  ```

### `GET /api/pets/:id`
Fetch complete pet details including medical dossier, reminders, weight logs, and active subscriptions.

- **URL Parameter**: `id` *(string)*: Pet ID.
- **Response `200 OK`**: Returns full pet object with relations.

---

## 2. NFC & QR Tag Operations

### `GET /api/tags/scan/:token`
Public NFC/QR lookup used by finders or veterinary scanners.

- **URL Parameter**: `token` *(string)*: Opaque secure token (e.g. `luna_sec_7891`).
- **Query Parameter**: `locale` *(optional)*: `"fr"` | `"ar"` | `"en"`.
- **Side Effect**: Increments `scanCount` and updates `lastScannedAt` in database. Logs audit event `TAG_SCANNED`.
- **Response `200 OK` (Strictly Sanitized)**:
  ```json
  {
    "success": true,
    "profile": {
      "petName": "Luna",
      "species": "CAT",
      "breed": "British Shorthair",
      "photoUrl": "https://images.unsplash.com/...",
      "approxAge": "3 ans",
      "sex": "FEMALE",
      "color": "Gris argenté / Silver Grey",
      "isLost": false,
      "lostNotes": null,
      "ownerContact": {
        "name": "Amine Berraoui",
        "phone": "+212 661 12 34 56",
        "whatsappUrl": "https://wa.me/212661123456?text=..."
      },
      "emergencyContact": {
        "name": "Yassine Berraoui (Frère)",
        "phone": "+212 663 44 55 66"
      },
      "vetClinic": {
        "clinicName": "Clinique Vétérinaire d'Anfa",
        "phone": "+212 661 44 55 66",
        "city": "Casablanca"
      },
      "tagStatus": "ACTIVE",
      "tagToken": "luna_sec_7891"
    }
  }
  ```

### `POST /api/tags/activate`
Bind a newly purchased physical ZAYA tag to a pet.

- **Request Body**:
  ```json
  {
    "code": "ZY-CAS-999",
    "token": "token_random_hash",
    "petId": "pet_luna_casablanca"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "tag": { "code": "ZY-CAS-999", "status": "ACTIVE" },
    "message": "Médaille ZAYA activée avec succès !"
  }
  ```

---

## 3. Emergency Lost Pet Protocol

### `POST /api/pets/:id/lost-mode`
Toggle urgent lost status for a pet.

- **URL Parameter**: `id` *(string)*: Pet ID.
- **Request Body**:
  ```json
  {
    "isLost": true,
    "lostNotes": "PERDU près du Parc de la Ligue Arabe à Casablanca. Répond au nom de Luna."
  }
  ```
- **Side Effects**:
  - Sets `isLost = true`, sets `lostSince = NOW()`.
  - Creates owner high-priority notification.
  - Logs `LOST_MODE_ACTIVATED` in `AuditLog`.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "pet": { "id": "...", "isLost": true },
    "message": "Mode Perdu activé"
  }
  ```

### `POST /api/finder-alert`
Public endpoint allowing a bystander/finder to alert the pet owner directly.

- **Request Body**:
  ```json
  {
    "token": "max_lost_demo_9921",
    "finderName": "Mehdi Tazi",
    "finderPhone": "+212 661 55 44 33",
    "location": "Avenue Hassan II, Rabat",
    "message": "Je suis avec votre chien, il boit de l'eau devant la pharmacie."
  }
  ```
- **Side Effects**:
  - Immediately dispatches an in-app notification and WhatsApp-ready event to the owner.
  - Logs `FINDER_ALERT_SUBMITTED` in `AuditLog`.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "L'alerte a été transmise immédiatement au propriétaire. Merci pour votre aide !"
  }
  ```

---

## 4. E-Commerce Marketplace & Reorder

### `GET /api/products`
Retrieve e-commerce catalog filtered by category and species.

- **Query Parameters**:
  - `categoryId` *(optional)*: Category identifier (e.g. `cat_alim`, `cat_sante`).
  - `targetSpecies` *(optional)*: `CAT` | `DOG` | `ALL`.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "products": [
      {
        "id": "prod_rc_british",
        "slug": "royal-canin-british-shorthair-4kg",
        "nameFr": "Royal Canin British Shorthair Adult 4kg",
        "priceMAD": 349.0,
        "compareAtPriceMAD": 389.0,
        "stock": 45,
        "targetSpecies": "CAT",
        "imageUrl": "https://...",
        "isRecurringEligible": true,
        "defaultIntervalDays": 30,
        "category": { "nameFr": "Alimentation" },
        "merchant": { "storeName": "Atlas Pet Boutique Casablanca" }
      }
    ],
    "categories": [...]
  }
  ```

### `POST /api/orders`
Place a new order with Moroccan fulfillment and payment integration.

- **Request Body**:
  ```json
  {
    "userId": "usr_amine_owner",
    "deliveryAddress": "14 Rue du Souvenir, Maarif",
    "city": "Casablanca",
    "phone": "+212 661 12 34 56",
    "paymentMethod": "CASH_ON_DELIVERY",
    "notes": "Sonner à l'interphone Berraoui",
    "items": [
      {
        "productId": "prod_rc_british",
        "quantity": 1,
        "unitPriceMAD": 349.0,
        "isRecurring": true,
        "intervalDays": 30
      }
    ]
  }
  ```
- **Moroccan Fee Logic**:
  - Free delivery if subtotal $\ge 450$ MAD.
  - 25 MAD flat courier rate if subtotal $< 450$ MAD.
- **Side Effects**:
  - Assigns Moroccan Cathedis tracking number (e.g. `ZAYA-MA-78211`).
  - Automatically initializes recurring subscription if `isRecurring: true`.
  - Logs `ORDER_CREATED` audit event.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "order": { "orderNumber": "ZAYA-ORD-48291", "totalMAD": 349.0, ... },
    "trackingNumber": "ZAYA-MA-78211",
    "paymentMessage": "Paiement en espèces à la livraison confirmé."
  }
  ```

### `POST /api/reorder`
**1-Click Reorder Engine**: Instantly duplicates the user's last delivered order.

- **Request Body**:
  ```json
  {
    "userId": "usr_amine_owner"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "order": { "orderNumber": "ZAYA-ORD-89211", "status": "PREPARING" },
    "message": "Commande ZAYA-ORD-89211 renouvelée avec succès !"
  }
  ```

---

## 5. Subscriptions

### `GET /api/subscriptions`
Retrieve active recurring subscriptions for replenishment.

- **Query Parameters**: `userId` *(optional)*.
- **Response `200 OK`**: List of subscriptions with scheduled delivery dates and 5% discount unit pricing.

### `PATCH /api/subscriptions/:id`
Modify subscription cadence or status.

- **Request Body**:
  ```json
  {
    "status": "PAUSED", // "ACTIVE" | "PAUSED" | "CANCELLED"
    "intervalDays": 45
  }
  ```

---

## 6. Veterinary Clinical Management

### `GET /api/vet/dashboard`
Aggregated veterinary clinical data.

- **Query Parameter**: `vetUserId` *(string)*: Vet user ID (e.g. `usr_dr_bennani`).
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "clinicName": "Clinique Vétérinaire d'Anfa",
      "totalPatients": 3,
      "vaccinesDueSoon": 5,
      "todayAppointments": 4,
      "managedPets": [...]
    }
  }
  ```

---

## 7. Admin KPIs & Auditing

### `GET /api/admin/metrics`
Supervisory metrics and platform health.

- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "metrics": {
      "ownersCount": 2,
      "petsCount": 3,
      "activeTagsCount": 3,
      "lostPetsCount": 1,
      "vetsCount": 2,
      "merchantsCount": 1,
      "ordersCount": 1,
      "gmvMAD": 453.0,
      "activeSubscriptionsCount": 1,
      "recentAuditLogs": [
        {
          "action": "TAG_SCANNED",
          "entity": "PetTag",
          "createdAt": "2026-09-13T13:00:25.000Z"
        }
      ]
    }
  }
  ```
