import { NextRequest, NextResponse } from "next/server";
import { getProducts, getCategories } from "@/lib/data-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const targetSpecies = searchParams.get("targetSpecies") || undefined;

    const [products, categories] = await Promise.all([
      getProducts(categoryId, targetSpecies),
      getCategories(),
    ]);

    return NextResponse.json({ success: true, products, categories });
  } catch (error: any) {
    console.error("Error in GET /api/products:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
