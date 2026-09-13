import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_amine_owner";

    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      include: {
        product: true,
        pet: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, subscriptions });
  } catch (error: any) {
    console.error("Error in GET /api/subscriptions:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
