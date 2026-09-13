import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, type, dueDate, recurrence, notes } = body;

    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      return NextResponse.json({ success: false, error: "Pet not found" }, { status: 404 });
    }

    const reminder = await prisma.reminder.create({
      data: {
        petId: id,
        ownerId: pet.ownerId,
        title,
        type: type || "CUSTOM",
        dueDate: new Date(dueDate),
        recurrence: recurrence || "NONE",
        status: "PENDING",
        notes,
      },
    });

    return NextResponse.json({ success: true, reminder });
  } catch (error: any) {
    console.error("Error in POST /api/pets/[id]/reminders:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
