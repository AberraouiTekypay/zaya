import { describe, it, expect } from "vitest";
import { generateWhatsAppLink } from "../src/lib/providers/NotificationProvider";
import { generateQRCodeDataUrl, getPublicScanUrl } from "../src/lib/qr";

describe("ZAYA Reminders, WhatsApp & QR Generator", () => {
  it("formats WhatsApp direct link with cleaned Moroccan phone and lost pet message in French", () => {
    const link = generateWhatsAppLink({
      phone: "+212 661 12 34 56",
      petName: "Luna",
      isLost: true,
      ownerName: "Amine",
      finderLocation: "Maarif Casablanca",
      locale: "fr",
    });

    expect(link).toContain("https://wa.me/212661123456");
    expect(link).toContain("Luna");
    expect(link).toContain("Maarif%20Casablanca");
  });

  it("formats WhatsApp direct link in Arabic for RTL Moroccan users", () => {
    const link = generateWhatsAppLink({
      phone: "0662987654",
      petName: "Max",
      isLost: true,
      ownerName: "سارة",
      locale: "ar",
    });

    expect(link).toContain("https://wa.me/0662987654");
    expect(link).toContain(encodeURIComponent("Max"));
    expect(link).toContain(encodeURIComponent("سارة"));
  });

  it("generates a high-quality QR code data URL for public scan token", async () => {
    const url = getPublicScanUrl("luna_sec_7891", "https://zaya.ma");
    expect(url).toBe("https://zaya.ma/p/luna_sec_7891");

    const qrData = await generateQRCodeDataUrl(url);
    expect(qrData).toMatch(/^data:image\/png;base64,/);
  });
});
