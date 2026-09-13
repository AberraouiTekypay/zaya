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

export const CURRENT_COUNTRY = MOROCCO_CONFIG;

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

export function formatPhone(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned;
}
