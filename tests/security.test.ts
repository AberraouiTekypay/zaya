import { describe, it, expect } from "vitest";
import { sanitizePetForPublicScan } from "../src/lib/security";

describe("ZAYA Security & Public Scan Sanitization", () => {
  it("strictly strips private medical records, owner address, and internal IDs from public tag scans", () => {
    const rawPet = {
      id: "internal_db_pet_id_99812",
      name: "Luna",
      species: "CAT",
      breed: "British Shorthair",
      birthDate: new Date("2023-04-10"),
      sex: "FEMALE",
      color: "Gris argenté",
      microchipNumber: "604098100234567",
      photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
      isLost: false,
      lostNotes: null,
      notes: "Private owner medical note: Sensitive digestive issue, needs hypoallergenic food only.",
      owner: {
        id: "internal_user_id_4412",
        name: "Amine Berraoui",
        email: "amine@zaya.ma",
        passwordHash: "super_secret_argon2_hash_that_must_never_leak",
        phone: "+212 661 12 34 56",
        address: "14 Rue du Souvenir, Maarif, Casablanca", // MUST NEVER LEAK
        city: "Casablanca",
      },
      healthRecords: [
        {
          id: "record_priv_001",
          type: "VACCINATION",
          title: "Confidential Blood Work Result",
        },
      ],
      documents: [
        {
          id: "doc_priv_001",
          title: "Private Medical Passport Scan.pdf",
          fileUrl: "https://s3.zaya.ma/private/passport_scan.pdf",
        },
      ],
      emergencyContact: "Yassine",
      emergencyPhone: "+212 663 44 55 66",
      vet: {
        clinicName: "Clinique Vétérinaire d'Anfa",
        phone: "+212 522 36 40 00",
        city: "Casablanca",
      },
    };

    const rawTag = {
      id: "internal_tag_id_001",
      code: "ZY-CAS-101",
      token: "luna_sec_7891",
      status: "ACTIVE",
    };

    const sanitized = sanitizePetForPublicScan(rawPet, rawTag, "fr");

    // 1. Check permitted public attributes
    expect(sanitized.petName).toBe("Luna");
    expect(sanitized.species).toBe("CAT");
    expect(sanitized.breed).toBe("British Shorthair");
    expect(sanitized.ownerContact.name).toBe("Amine Berraoui");
    expect(sanitized.ownerContact.phone).toBe("+212 661 12 34 56");
    expect(sanitized.ownerContact.whatsappUrl).toContain("https://wa.me/212661123456");
    expect(sanitized.emergencyContact?.name).toBe("Yassine");
    expect(sanitized.vetClinic?.clinicName).toBe("Clinique Vétérinaire d'Anfa");

    // 2. STRICT SECURITY CHECKS: Guarantee zero leakage of sensitive data
    expect((sanitized as any).id).toBeUndefined();
    expect((sanitized as any).address).toBeUndefined();
    expect((sanitized as any).passwordHash).toBeUndefined();
    expect((sanitized as any).healthRecords).toBeUndefined();
    expect((sanitized as any).documents).toBeUndefined();
    expect((sanitized as any).notes).toBeUndefined();
    expect((sanitized.ownerContact as any).address).toBeUndefined();
    expect((sanitized.ownerContact as any).email).toBeUndefined();
  });

  it("exposes urgent alert and lost notes when pet is marked lost", () => {
    const lostPet = {
      name: "Max",
      species: "DOG",
      breed: "Berger Allemand",
      isLost: true,
      lostNotes: "Perdu près du parc Hilton à Rabat. Répond à son nom.",
      lostSince: new Date("2026-09-12T14:30:00Z"),
      owner: {
        name: "Sarah El Fassi",
        phone: "+212 662 98 76 54",
      },
    };

    const tag = { code: "ZY-RAB-204", token: "max_lost_demo_9921", status: "ACTIVE" };
    const sanitized = sanitizePetForPublicScan(lostPet, tag, "fr");

    expect(sanitized.isLost).toBe(true);
    expect(sanitized.lostNotes).toContain("Perdu près du parc Hilton");
    expect(sanitized.ownerContact.whatsappUrl).toContain("retrouv%C3%A9%20votre%20animal%20Max");
  });
});
