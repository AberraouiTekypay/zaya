import { NextRequest, NextResponse } from "next/server";
import { getVetDashboardData } from "@/lib/data-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vetUserId = searchParams.get("vetUserId") || "usr_dr_bennani";

    const data = await getVetDashboardData(vetUserId);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in GET /api/vet/dashboard:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
