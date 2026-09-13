import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logSecurityAudit } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { petId, tagCode, customToken } = body;

    if (!petId) {
      return NextResponse.json({ success: false, error: "petId is required" }, { status: 400 });
    }

    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: { tag: true },
    });

    if (!pet) {
      return NextResponse.json({ success: false, error: "Pet not found" }, { status: 404 });
    }

    // Generate code and secure token if not specified
    const code = tagCode || `ZY-${pet.name.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`;
    const token = customToken || `tag_${pet.name.toLowerCase()}_${Math.random().toString(36).substring(2, 9)}`;

    let tag;
    if (pet.tag) {
      // Update existing tag
      tag = await prisma.petTag.update({
        where: { id: pet.tag.id },
        data: {
          code,
          token,
          status: "ACTIVE",
          activatedAt: new Date(),
        },
      });
    } else {
      // Create new tag
      tag = await prisma.petTag.create({
        data: {
          code,
          token,
          status: "ACTIVE",
          petId: pet.id,
          activatedAt: new Date(),
        },
      });
    }

    await logSecurityAudit({
      action: "TAG_ACTIVATED",
      entity: "PetTag",
      entityId: tag.id,
      details: { petId: pet.id, petName: pet.name, code: tag.code, token: tag.token },
    });

    return NextResponse.json({
      success: true,
      tag,
      publicUrl: `/p/${tag.token}`,
      message: `Médaille ZAYA ${tag.code} activée avec succès pour ${pet.name}`,
    });
  } catch (error: any) {
    console.error("Error in POST /api/tags/activate:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
