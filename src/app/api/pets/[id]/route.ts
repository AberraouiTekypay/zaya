import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logSecurityAudit } from "@/lib/security";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pet = await prisma.pet.findUnique({
      where: { id },
      include: {
        owner: true,
        vet: true,
        tag: true,
        healthRecords: {
          orderBy: { dateAdministered: "desc" },
        },
        documents: {
          orderBy: { createdAt: "desc" },
        },
        weights: {
          orderBy: { recordedAt: "desc" },
        },
        reminders: {
          orderBy: { dueDate: "asc" },
        },
        subscriptions: {
          include: { product: true },
        },
      },
    });

    if (!pet) {
      return NextResponse.json({ success: false, error: "Pet not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, pet });
  } catch (error: any) {
    console.error("Error in GET /api/pets/[id]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.pet.update({
      where: { id },
      data: {
        name: body.name,
        breed: body.breed,
        birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
        sex: body.sex,
        color: body.color,
        microchipNumber: body.microchipNumber,
        notes: body.notes,
        photoUrl: body.photoUrl,
        emergencyContact: body.emergencyContact,
        emergencyPhone: body.emergencyPhone,
      },
      include: {
        tag: true,
      },
    });

    await logSecurityAudit({
      action: "PET_UPDATED",
      entity: "Pet",
      entityId: id,
      details: { name: updated.name },
    });

    return NextResponse.json({ success: true, pet: updated });
  } catch (error: any) {
    console.error("Error in PUT /api/pets/[id]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
