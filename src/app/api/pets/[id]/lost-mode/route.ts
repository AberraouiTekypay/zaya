import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logSecurityAudit } from "@/lib/security";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { isLost, lostNotes } = body;

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { tag: true, owner: true },
    });

    if (!pet) {
      return NextResponse.json({ success: false, error: "Pet not found" }, { status: 404 });
    }

    const updated = await prisma.pet.update({
      where: { id },
      data: {
        isLost: Boolean(isLost),
        lostNotes: isLost ? (lostNotes || "Animal déclaré perdu. Merci de contacter le propriétaire.") : null,
        lostSince: isLost ? new Date() : null,
      },
      include: { tag: true },
    });

    // Create a notification for the owner
    await prisma.notification.create({
      data: {
        userId: pet.ownerId,
        title: isLost ? `🚨 Mode Perdu activé pour ${pet.name}` : `✅ Mode Perdu désactivé pour ${pet.name}`,
        message: isLost
          ? `La page publique de ${pet.name} est maintenant configurée en alerte d'urgence. Tous les scans afficheront les boutons d'appel et WhatsApp directs.`
          : `Heureux de savoir que ${pet.name} est en sécurité ! La fiche publique a été remise en statut normal.`,
        type: "LOST_PET",
        link: `/app/pets/${pet.id}`,
      },
    });

    await logSecurityAudit({
      userId: pet.ownerId,
      action: isLost ? "LOST_MODE_ACTIVATED" : "LOST_MODE_DEACTIVATED",
      entity: "Pet",
      entityId: pet.id,
      details: { petName: pet.name, tagCode: pet.tag?.code, isLost },
    });

    return NextResponse.json({
      success: true,
      pet: updated,
      message: isLost ? "Mode Perdu activé" : "Mode Perdu désactivé",
    });
  } catch (error: any) {
    console.error("Error toggling lost mode:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
