import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPaymentProvider } from "@/lib/providers/PaymentProvider";
import { defaultDeliveryProvider } from "@/lib/providers/DeliveryProvider";
import { logSecurityAudit } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_amine_owner";

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Error in GET /api/orders:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId = "usr_amine_owner",
      items,
      paymentMethod = "CASH_ON_DELIVERY",
      deliveryAddress,
      city = "Casablanca",
      phone,
      notes,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Le panier est vide." }, { status: 400 });
    }

    if (!deliveryAddress || !phone) {
      return NextResponse.json(
        { success: false, error: "Adresse et téléphone de livraison requis." },
        { status: 400 }
      );
    }

    // Calculate subtotal
    const subtotal = items.reduce((acc: number, item: any) => acc + item.unitPriceMAD * item.quantity, 0);
    const deliveryFee = subtotal >= 450 ? 0 : 25;
    const total = subtotal + deliveryFee;

    const orderNumber = `ZAYA-ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    // Process payment via provider abstraction
    const paymentProvider = getPaymentProvider(paymentMethod);
    const paymentResult = await paymentProvider.processPayment({
      orderId: orderNumber,
      orderNumber,
      amountMAD: total,
      customerName: "Client ZAYA",
      customerPhone: phone,
      method: paymentMethod,
    });

    // Create delivery shipment via Moroccan courier provider abstraction
    const shipmentResult = await defaultDeliveryProvider.createShipment({
      orderId: orderNumber,
      orderNumber,
      recipientName: "Client ZAYA",
      recipientPhone: phone,
      address: deliveryAddress,
      city,
      amountToCollectMAD: paymentMethod === "CASH_ON_DELIVERY" ? total : 0,
      packageDescription: `Commande ZAYA ${orderNumber} (${items.length} articles)`,
    });

    // Save order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        subtotalMAD: subtotal,
        deliveryFeeMAD: deliveryFee,
        totalMAD: total,
        paymentMethod,
        paymentStatus: paymentResult.status,
        deliveryStatus: "PREPARING",
        trackingNumber: shipmentResult.trackingNumber,
        deliveryAddress,
        city,
        phone,
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPriceMAD: item.unitPriceMAD,
            totalPriceMAD: item.unitPriceMAD * item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // If any item was marked as recurring subscription, create subscriptions!
    for (const item of items) {
      if (item.isRecurring) {
        // Find owner's first pet to link subscription
        const firstPet = await prisma.pet.findFirst({ where: { ownerId: userId } });
        if (firstPet) {
          const nextDelivery = new Date();
          nextDelivery.setDate(nextDelivery.getDate() + (item.intervalDays || 30));

          await prisma.subscription.create({
            data: {
              userId,
              petId: firstPet.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPriceMAD: item.unitPriceMAD,
              intervalDays: item.intervalDays || 30,
              nextDeliveryDate: nextDelivery,
              status: "ACTIVE",
              deliveryAddress,
              city,
              phone,
            },
          });
        }
      }
    }

    await logSecurityAudit({
      userId,
      action: "ORDER_CREATED",
      entity: "Order",
      entityId: order.id,
      details: { orderNumber, total, paymentMethod, tracking: shipmentResult.trackingNumber },
    });

    return NextResponse.json({
      success: true,
      order,
      trackingNumber: shipmentResult.trackingNumber,
      paymentMessage: paymentResult.message,
    });
  } catch (error: any) {
    console.error("Error in POST /api/orders:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
