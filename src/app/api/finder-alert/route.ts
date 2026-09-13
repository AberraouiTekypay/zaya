import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logSecurityAudit } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, finderName, finderPhone, location, message } = body;

    if (!token || !finderPhone) {
      return NextResponse.json(
        { success: false, error: "Le jeton et le numéro de téléphone sont requis." },
        { status: 400 }
      );
    }

    const tag = await prisma.petTag.findUnique({
      where: { token },
      include: {
        pet: {
          include: { owner: true },
        },
      },
    });

    if (!tag || !tag.pet) {
      return NextResponse.json({ success: false, error: "Animal introuvable" }, { status: 404 });
    }

    // Create high-priority notification for pet owner
    await prisma.notification.create({
      data: {
        userId: tag.pet.ownerId,
        title: `🚨 ALERTE TROUVÉ : ${tag.pet.name}`,
        message: `${finderName || "Un bienfaiteur"} a scanné la médaille de ${tag.pet.name} à ${location || "un endroit non précisé"}. Tél: ${finderPhone}. Note: "${message || "Aucune note"}"`,
        type: "LOST_PET",
        link: `/app/pets/${tag.pet.id}`,
      },
    });

    await logSecurityAudit({
      userId: tag.pet.ownerId,
      action: "FINDER_ALERT_SUBMITTED",
      entity: "Pet",
      entityId: tag.pet.id,
      details: {
        petName: tag.pet.name,
        finderName,
        finderPhone,
        location,
      },
    });

    return NextResponse.json({
      success: true,
      message: "L'alerte a été transmise immédiatement au propriétaire. Merci pour votre aide !",
    });
  } catch (error: any) {
    console.error("Error in POST /api/finder-alert:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
