import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logSecurityAudit } from "@/lib/security";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, intervalDays, nextDeliveryDate } = body;

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: { product: true, pet: true },
    });

    if (!subscription) {
      return NextResponse.json({ success: false, error: "Subscription not found" }, { status: 404 });
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        status: status || undefined,
        intervalDays: intervalDays || undefined,
        nextDeliveryDate: nextDeliveryDate ? new Date(nextDeliveryDate) : undefined,
      },
      include: { product: true, pet: true },
    });

    await logSecurityAudit({
      userId: subscription.userId,
      action: "SUBSCRIPTION_STATUS_UPDATED",
      entity: "Subscription",
      entityId: id,
      details: { newStatus: status, intervalDays },
    });

    return NextResponse.json({
      success: true,
      subscription: updated,
      message: `Abonnement ${status === "PAUSED" ? "suspendu" : status === "ACTIVE" ? "réactivé" : "mis à jour"} avec succès.`,
    });
  } catch (error: any) {
    console.error("Error updating subscription:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
