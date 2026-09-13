import { describe, it, expect } from "vitest";
import {
  getProducts,
  getProductBySlug,
  getCategories,
  getPetByTagToken,
} from "../src/lib/data-service";

describe("Data Service Resilient Fallbacks", () => {
  it("should return products even if database is empty/unseeded", async () => {
    const products = await getProducts();
    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThan(0);

    const tagProduct = products.find((p) => p.slug === "medaille-zaya-nfc-inox");
    expect(tagProduct).toBeDefined();
    expect(tagProduct?.priceMAD).toBe(79);
  });

  it("should retrieve a single product by slug correctly", async () => {
    const product = await getProductBySlug("royal-canin-british-shorthair-4kg");
    expect(product).toBeDefined();
    expect(product?.nameFr).toContain("Royal Canin British Shorthair");
    expect(product?.priceMAD).toBe(349);
    expect(product?.isRecurringEligible).toBe(true);
  });

  it("should return product categories", async () => {
    const categories = await getCategories();
    expect(categories.length).toBeGreaterThanOrEqual(4);
    const slugs = categories.map((c) => c.slug);
    expect(slugs).toContain("alimentation");
    expect(slugs).toContain("accessoires-confort");
  });

  it("should return sanitized pet for Luna by tag token", async () => {
    const pet = await getPetByTagToken("luna_sec_7891", "fr");
    expect(pet).toBeDefined();
    expect(pet?.petName).toBe("Luna");
    expect(pet?.isLost).toBe(false);
    expect(pet?.ownerContact.phone).toBe("+212 661 12 34 56");
  });

  it("should return sanitized pet for Max with LOST mode active", async () => {
    const pet = await getPetByTagToken("max_lost_demo_9921", "fr");
    expect(pet).toBeDefined();
    expect(pet?.petName).toBe("Max");
    expect(pet?.isLost).toBe(true);
    expect(pet?.lostNotes).toContain("PERDU");
  });
});
