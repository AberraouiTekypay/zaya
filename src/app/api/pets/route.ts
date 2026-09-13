import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logSecurityAudit } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId") || "usr_amine_owner";

    const pets = await prisma.pet.findMany({
      where: { ownerId },
      include: {
        tag: true,
        reminders: {
          orderBy: { dueDate: "asc" },
        },
        healthRecords: {
          orderBy: { dateAdministered: "desc" },
          take: 5,
        },
        subscriptions: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, pets });
  } catch (error: any) {
    console.error("Error in GET /api/pets:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      species,
      breed,
      birthDate,
      sex,
      color,
      microchipNumber,
      photoUrl,
      notes,
      ownerId = "usr_amine_owner",
      emergencyContact,
      emergencyPhone,
      activateTag,
    } = body;

    if (!name || !species) {
      return NextResponse.json({ success: false, error: "Name and species are required" }, { status: 400 });
    }

    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        breed,
        birthDate: birthDate ? new Date(birthDate) : null,
        sex: sex || "FEMALE",
        color,
        microchipNumber: microchipNumber || null,
        photoUrl: photoUrl || (species === "CAT" 
          ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80"),
        notes,
        ownerId,
        emergencyContact,
        emergencyPhone,
      },
    });

    // Auto-generate tag if requested
    if (activateTag !== false) {
      const codeSuffix = Math.floor(100 + Math.random() * 900);
      const tokenRandom = Math.random().toString(36).substring(2, 8);
      const tagCode = `ZY-${pet.name.toUpperCase().slice(0, 3)}-${codeSuffix}`;
      const tagToken = `tag_${pet.name.toLowerCase()}_${tokenRandom}`;

      await prisma.petTag.create({
        data: {
          code: tagCode,
          token: tagToken,
          status: "ACTIVE",
          petId: pet.id,
          activatedAt: new Date(),
        },
      });
    }

    await logSecurityAudit({
      userId: ownerId,
      action: "PET_CREATED",
      entity: "Pet",
      entityId: pet.id,
      details: { name: pet.name, species: pet.species },
    });

    const fullPet = await prisma.pet.findUnique({
      where: { id: pet.id },
      include: { tag: true, reminders: true },
    });

    return NextResponse.json({ success: true, pet: fullPet });
  } catch (error: any) {
    console.error("Error in POST /api/pets:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
