# ZAYA — Moroccan Localization & Internationalization Architecture

This document outlines how ZAYA implements first-class localization for the Moroccan market while maintaining a modular abstraction for rapid expansion into the GCC (UAE, Saudi Arabia) and Europe (France, Spain).

---

## 1. Moroccan Market Specifications

| Dimension | Moroccan Configuration (`MOROCCO_CONFIG`) | Implementation Reference |
|---|---|---|
| **Country Code** | `MA` (Maroc / المغرب) | [`src/lib/country.ts`](file:///C:/zaya/src/lib/country.ts) |
| **Currency** | **MAD** (Dirham Marocain / د.م.) | `formatPrice(amount, locale)` |
| **Decimals** | 2 decimals max, zero decimals formatted when integer (e.g. `79 MAD`, not `79.00 MAD`) | Native `toLocaleString('fr-FR' / 'ar-MA')` |
| **Telephone** | Calling code `+212`. Mobile prefixes `06` / `07`, landlines `05`. | `formatPhone(phone)` |
| **Standard Delivery Fee** | **25 MAD** flat courier rate | [`src/lib/country.ts`](file:///C:/zaya/src/lib/country.ts) |
| **Free Delivery Threshold** | Orders over **450 MAD** receive free shipping | Evaluated in cart and checkout |
| **Payment Gateways** | Cash on Delivery (Espèces à la livraison) + Moroccan CMI 3D-Secure | [`src/lib/providers/PaymentProvider.ts`](file:///C:/zaya/src/lib/providers/PaymentProvider.ts) |
| **Logistics Couriers** | Cathedis, Express Maroc, Amana Express | [`src/lib/providers/DeliveryProvider.ts`](file:///C:/zaya/src/lib/providers/DeliveryProvider.ts) |
| **Supported Cities** | Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès, Meknès, Mohammedia, Kénitra | City selector in checkout |

---

## 2. Multi-Language & RTL Layout Engine

ZAYA supports three languages with immediate client-side switching:
1. **Français (`fr`)**: Default business and clinical language in Morocco.
2. **العربية (`ar`)**: Full Right-to-Left (RTL) layout with Arabic numerals and localized typography.
3. **English (`en`)**: Ready for international partners and tourists.

### 2.1 The RTL Architecture
When the user switches to Arabic (`ar`), the following cascade occurs:
1. `LanguageContext` updates `locale` state to `"ar"` and sets `dir` state to `"rtl"`.
2. The root `document.documentElement` receives `dir="rtl"` and `lang="ar"`.
3. Tailwind CSS logical properties or bidirectional flexbox automatically flip navigation bars, drawers, and form alignments.
4. WhatsApp emergency messages flip to formal Moroccan Arabic:
   ```arabic
   مرحباً [المالك]، لقد عثرت على حيوانك الأليف [الاسم] عبر مسح ميدالية ZAYA الذكية. أنا هنا للمساعدة في إعادته إليك.
   ```

### 2.2 Dictionary Structure
Translations reside in typed dictionary files:
- [`src/i18n/dictionaries/fr.ts`](file:///C:/zaya/src/i18n/dictionaries/fr.ts)
- [`src/i18n/dictionaries/ar.ts`](file:///C:/zaya/src/i18n/dictionaries/ar.ts)
- [`src/i18n/dictionaries/en.ts`](file:///C:/zaya/src/i18n/dictionaries/en.ts)

A lightweight translation hook `useTranslation()` provides safe key lookups:
```tsx
import { useTranslation } from "@/i18n/context";

export function ReorderButton() {
  const { t } = useTranslation();
  return <button>{t("orders.reorderButton")}</button>;
}
```

---

## 3. WhatsApp Direct Integration Engine

In Morocco, WhatsApp is the primary communication channel between citizens, clinics, and couriers. ZAYA leverages direct `wa.me` links with URL-encoded bilingual text:

```typescript
// Formulation logic in src/lib/providers/NotificationProvider.ts
export function generateWhatsAppLink(params: WhatsAppMessageParams): string {
  const cleanPhone = params.phone.replace(/[^\d]/g, "");
  const text = params.isLost
    ? `Bonjour ${params.ownerName} ! J'ai retrouvé votre animal ${params.petName} grâce à sa médaille ZAYA.`
    : `Bonjour ! J'ai scanné la médaille ZAYA de ${params.petName}.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
```

---

## 4. International Expansion Blueprint

To deploy ZAYA into a new region (such as the UAE or Saudi Arabia):
1. **Define Country Config**: Add `UAE_CONFIG` or `KSA_CONFIG` in `src/lib/country.ts` with currency `AED` / `SAR`, local calling code `+971` / `+966`, and courier partners (e.g. Aramex).
2. **Set Active Country**: Set `CURRENT_COUNTRY = UAE_CONFIG` or configure dynamic domain detection (e.g., `zaya.ae` vs `zaya.ma`).
3. **Attach Payment Provider**: Swap CMI for Telr / PayTabs / Stripe in `src/lib/providers/PaymentProvider.ts`.
