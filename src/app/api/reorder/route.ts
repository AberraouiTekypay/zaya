import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { defaultDeliveryProvider } from "@/lib/providers/DeliveryProvider";
import { logSecurityAudit } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = "usr_amine_owner" } = body;

    // Find the latest order for this user
    const lastOrder = await prisma.order.findFirst({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!lastOrder || lastOrder.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Aucune commande précédente à répéter." },
        { status: 404 }
      );
    }

    const orderNumber = `ZAYA-ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const shipmentResult = await defaultDeliveryProvider.createShipment({
      orderId: orderNumber,
      orderNumber,
      recipientName: "Client ZAYA",
      recipientPhone: lastOrder.phone,
      address: lastOrder.deliveryAddress,
      city: lastOrder.city,
      amountToCollectMAD: lastOrder.paymentMethod === "CASH_ON_DELIVERY" ? lastOrder.totalMAD : 0,
      packageDescription: `Réassort ZAYA ${orderNumber}`,
    });

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        subtotalMAD: lastOrder.subtotalMAD,
        deliveryFeeMAD: lastOrder.deliveryFeeMAD,
        totalMAD: lastOrder.totalMAD,
        paymentMethod: lastOrder.paymentMethod,
        paymentStatus: "PENDING",
        deliveryStatus: "PREPARING",
        trackingNumber: shipmentResult.trackingNumber,
        deliveryAddress: lastOrder.deliveryAddress,
        city: lastOrder.city,
        phone: lastOrder.phone,
        notes: `Réassort automatique express répétant la commande ${lastOrder.orderNumber}`,
        items: {
          create: lastOrder.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPriceMAD: item.unitPriceMAD,
            totalPriceMAD: item.totalPriceMAD,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    await logSecurityAudit({
      userId,
      action: "REORDER_EXECUTED",
      entity: "Order",
      entityId: newOrder.id,
      details: {
        originalOrder: lastOrder.orderNumber,
        newOrder: newOrder.orderNumber,
        total: newOrder.totalMAD,
      },
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: `Commande ${newOrder.orderNumber} renouvelée avec succès !`,
    });
  } catch (error: any) {
    console.error("Error in POST /api/reorder:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
