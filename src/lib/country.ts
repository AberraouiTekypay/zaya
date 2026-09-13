/**
 * ZAYA Country & Regional Configuration Engine
 *
 * Provides localized constants, currency formatting, telephone normalization,
 * and delivery pricing rules. Defaults to Morocco (MA) with Moroccan Dirhams (MAD).
 *
 * @module lib/country
 */

export interface CountryConfig {
  code: string;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  defaultLocale: "fr" | "ar" | "en";
  supportedLocales: ("fr" | "ar" | "en")[];
  currency: {
    code: string;
    symbolFr: string;
    symbolAr: string;
    symbolEn: string;
    decimals: number;
  };
  phone: {
    callingCode: string;
    placeholder: string;
    example: string;
  };
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number;
  cities: {
    id: string;
    nameFr: string;
    nameAr: string;
    nameEn: string;
  }[];
  paymentMethods: {
    id: string;
    nameFr: string;
    nameAr: string;
    nameEn: string;
    descriptionFr: string;
    descriptionAr: string;
  }[];
}

/**
 * Standard configuration for the Kingdom of Morocco launch market.
 * - Currency: MAD (د.م.)
 * - Delivery: 25 MAD flat fee, free above 450 MAD.
 * - Gateways: Cash on Delivery & Moroccan CMI 3D-Secure.
 */
export const MOROCCO_CONFIG: CountryConfig = {
  code: "MA",
  nameFr: "Maroc",
  nameAr: "المغرب",
  nameEn: "Morocco",
  defaultLocale: "fr",
  supportedLocales: ["fr", "ar", "en"],
  currency: {
    code: "MAD",
    symbolFr: "MAD",
    symbolAr: "د.م.",
    symbolEn: "MAD",
    decimals: 2,
  },
  phone: {
    callingCode: "+212",
    placeholder: "+212 6XX XX XX XX",
    example: "+212 661 12 34 56",
  },
  defaultDeliveryFee: 25,
  freeDeliveryThreshold: 450,
  cities: [
    { id: "casablanca", nameFr: "Casablanca", nameAr: "الدار البيضاء", nameEn: "Casablanca" },
    { id: "rabat", nameFr: "Rabat", nameAr: "الرباط", nameEn: "Rabat" },
    { id: "marrakech", nameFr: "Marrakech", nameAr: "مراكش", nameEn: "Marrakech" },
    { id: "tanger", nameFr: "Tanger", nameAr: "طنجة", nameEn: "Tangier" },
    { id: "agadir", nameFr: "Agadir", nameAr: "أكادير", nameEn: "Agadir" },
    { id: "fes", nameFr: "Fès", nameAr: "فاس", nameEn: "Fez" },
    { id: "meknes", nameFr: "Meknès", nameAr: "مكناس", nameEn: "Meknes" },
    { id: "mohammedia", nameFr: "Mohammedia", nameAr: "المحمدية", nameEn: "Mohammedia" },
    { id: "kenitra", nameFr: "Kénitra", nameAr: "القنيطرة", nameEn: "Kenitra" },
  ],
  paymentMethods: [
    {
      id: "CASH_ON_DELIVERY",
      nameFr: "Paiement à la livraison (Espèces)",
      nameAr: "الدفع عند الاستلام (نقداً)",
      nameEn: "Cash on Delivery",
      descriptionFr: "Réglez directement auprès du livreur à la réception de votre commande.",
      descriptionAr: "ادفع مباشرة لمندوب التوصيل عند استلام طلبيتك.",
    },
    {
      id: "CMI_CARD",
      nameFr: "Carte bancaire marocaine (CMI)",
      nameAr: "البطاقة البنكية المغربية (CMI)",
      nameEn: "Moroccan Bank Card (CMI)",
      descriptionFr: "Paiement 100% sécurisé via le Centre Monétique Interbancaire.",
      descriptionAr: "دفع آمن 100% عبر مركز النقديات المغربي.",
    },
  ],
};

/**
 * Current active regional deployment configuration.
 */
export const CURRENT_COUNTRY = MOROCCO_CONFIG;

/**
 * Formats a numeric price into a localized currency string.
 * Uses integer formatting for whole amounts (e.g. "79 MAD") and up to 2 decimal places.
 *
 * @param amount - Numeric price value
 * @param locale - Target language ('fr' | 'ar' | 'en')
 * @returns Formatted currency string (e.g., "349 MAD" or "349 د.م.")
 *
 * @example
 * formatPrice(79, 'fr') // "79 MAD"
 * formatPrice(79, 'ar') // "79 د.م."
 */
export function formatPrice(amount: number, locale: "fr" | "ar" | "en" = "fr"): string {
  const formatted = amount.toLocaleString(locale === "ar" ? "ar-MA" : "fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (locale === "ar") {
    return `${formatted} ${MOROCCO_CONFIG.currency.symbolAr}`;
  }
  return `${formatted} ${MOROCCO_CONFIG.currency.symbolFr}`;
}

/**
 * Normalizes a phone number to standard international dialable format.
 *
 * @param phone - Raw telephone input string
 * @returns Clean dialable digits preserving '+' prefix
 */
export function formatPhone(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned;
}
