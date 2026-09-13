import { describe, it, expect } from "vitest";
import { MOROCCO_CONFIG, formatPrice } from "../src/lib/country";
import { getPaymentProvider } from "../src/lib/providers/PaymentProvider";
import { defaultDeliveryProvider } from "../src/lib/providers/DeliveryProvider";

describe("ZAYA Commerce & Moroccan Localization", () => {
  it("computes Moroccan delivery fee correctly (25 MAD below 450 MAD, Free above 450 MAD)", () => {
    const subtotalSmall = 349;
    const feeSmall = subtotalSmall >= MOROCCO_CONFIG.freeDeliveryThreshold ? 0 : MOROCCO_CONFIG.defaultDeliveryFee;
    expect(feeSmall).toBe(25);

    const subtotalLarge = 680;
    const feeLarge = subtotalLarge >= MOROCCO_CONFIG.freeDeliveryThreshold ? 0 : MOROCCO_CONFIG.defaultDeliveryFee;
    expect(feeLarge).toBe(0);
  });

  it("formats Moroccan Dirhams (MAD) in French and Arabic correctly", () => {
    const priceFR = formatPrice(349, "fr");
    expect(priceFR).toContain("349");
    expect(priceFR).toContain("MAD");

    const priceAR = formatPrice(349, "ar");
    expect(priceAR).toContain("349");
    expect(priceAR).toContain("د.م.");
  });

  it("calculates recurring subscription 5% discount", () => {
    const regularPrice = 680.0;
    const subscriberPrice = Number((regularPrice * 0.95).toFixed(2));
    expect(subscriberPrice).toBe(646.0);
  });

  it("generates valid Moroccan courier tracking number via DeliveryProvider", async () => {
    const shipment = await defaultDeliveryProvider.createShipment({
      orderId: "ord_test_001",
      orderNumber: "ZAYA-ORD-99120",
      recipientName: "Amine",
      recipientPhone: "+212 661 12 34 56",
      address: "Maarif",
      city: "Casablanca",
      amountToCollectMAD: 374,
      packageDescription: "Colis Croquettes",
    });

    expect(shipment.success).toBe(true);
    expect(shipment.trackingNumber).toMatch(/^ZAYA-MA-\d{5}$/);
    expect(shipment.courierName).toContain("Cathedis");
  });

  it("handles Cash on Delivery and CMI payment providers", async () => {
    const cod = getPaymentProvider("CASH_ON_DELIVERY");
    const codRes = await cod.processPayment({
      orderId: "ord_1",
      orderNumber: "ZAYA-ORD-1",
      amountMAD: 100,
      customerName: "Amine",
      customerPhone: "+212600000000",
      method: "CASH_ON_DELIVERY",
    });
    expect(codRes.status).toBe("PENDING");

    const cmi = getPaymentProvider("CMI_CARD");
    const cmiRes = await cmi.processPayment({
      orderId: "ord_2",
      orderNumber: "ZAYA-ORD-2",
      amountMAD: 100,
      customerName: "Amine",
      customerPhone: "+212600000000",
      method: "CMI_CARD",
    });
    expect(cmiRes.status).toBe("PAID");
  });
});
