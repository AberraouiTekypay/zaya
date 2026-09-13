import { NextRequest, NextResponse } from "next/server";
import { getPetByTagToken } from "@/lib/data-service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { searchParams } = new URL(req.url);
    const locale = (searchParams.get("locale") || "fr") as "fr" | "ar" | "en";

    const publicProfile = await getPetByTagToken(token, locale);

    if (!publicProfile) {
      return NextResponse.json(
        { success: false, error: "Médaille non trouvée ou inactive" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, profile: publicProfile });
  } catch (error: any) {
    console.error("Error in GET /api/tags/scan/[token]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
