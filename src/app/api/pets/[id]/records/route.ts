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
    const {
      type,
      title,
      description,
      dateAdministered,
      nextDueDate,
      providerName,
      batchNumber,
      documentUrl,
      createReminderAuto = true,
    } = body;

    if (!type || !title) {
      return NextResponse.json({ success: false, error: "Type and title are required" }, { status: 400 });
    }

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!pet) {
      return NextResponse.json({ success: false, error: "Pet not found" }, { status: 404 });
    }

    const record = await prisma.petHealthRecord.create({
      data: {
        petId: id,
        type,
        title,
        description,
        dateAdministered: dateAdministered ? new Date(dateAdministered) : new Date(),
        nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
        providerName,
        batchNumber,
        documentUrl,
      },
    });

    // If nextDueDate is specified and createReminderAuto is true, automatically schedule a reminder!
    if (nextDueDate && createReminderAuto) {
      const reminderDate = new Date(nextDueDate);
      await prisma.reminder.create({
        data: {
          petId: pet.id,
          ownerId: pet.ownerId,
          title: `Rappel : ${title}`,
          type: type === "VACCINATION" ? "VACCINATION" : type === "FLEA_TICK" ? "FLEA_TICK" : "MEDICATION",
          dueDate: reminderDate,
          recurrence: type === "VACCINATION" ? "YEARLY" : type === "FLEA_TICK" ? "EVERY_30_DAYS" : "NONE",
          status: "PENDING",
          notes: `Généré automatiquement suite au soin du ${new Date(dateAdministered || Date.now()).toLocaleDateString("fr-FR")}`,
        },
      });
    }

    await logSecurityAudit({
      userId: pet.ownerId,
      action: "HEALTH_RECORD_ADDED",
      entity: "PetHealthRecord",
      entityId: record.id,
      details: { petName: pet.name, type, title },
    });

    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    console.error("Error in POST /api/pets/[id]/records:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
