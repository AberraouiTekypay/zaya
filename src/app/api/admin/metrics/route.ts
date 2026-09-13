import { NextRequest, NextResponse } from "next/server";
import { getAdminMetrics } from "@/lib/data-service";

export async function GET(req: NextRequest) {
  try {
    const metrics = await getAdminMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (error: any) {
    console.error("Error in GET /api/admin/metrics:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
