import { prisma } from "./db";

export interface PublicPetProfile {
  petName: string;
  species: string;
  breed: string | null;
  photoUrl: string | null;
  approxAge: string | null;
  sex: string;
  color: string | null;
  isLost: boolean;
  lostNotes: string | null;
  lostSince: string | null;
  ownerContact: {
    name: string;
    phone: string;
    whatsappUrl: string;
  };
  emergencyContact: {
    name: string | null;
    phone: string | null;
  } | null;
  vetClinic: {
    clinicName: string;
    phone: string;
    city: string;
  } | null;
  tagStatus: string;
  tagToken: string;
}

/**
 * Sanitizes pet data for the public NFC/QR scan page.
 * Strictly strips:
 * - Owner home address
 * - Owner email & password hash
 * - Internal database IDs (User.id, Pet.id, Tag.id)
 * - Private medical records, vaccination batches, doctor private notes
 * - Private uploaded documents
 */
export function sanitizePetForPublicScan(pet: any, tag: any, locale: "fr" | "ar" | "en" = "fr"): PublicPetProfile {
  // Calculate approximate age without exposing exact birth date if preferred
  let approxAge = null;
  if (pet.birthDate) {
    const years = Math.max(0, Math.floor((Date.now() - new Date(pet.birthDate).getTime()) / (365.25 * 24 * 3600 * 1000)));
    if (locale === "ar") {
      approxAge = years <= 1 ? "سنة واحدة" : `${years} سنوات`;
    } else {
      approxAge = years <= 1 ? "1 an" : `${years} ans`;
    }
  }

  const cleanOwnerPhone = pet.owner?.phone || "+212600000000";

  // Generate WhatsApp link
  let whatsappText = "";
  if (locale === "ar") {
    whatsappText = pet.isLost
      ? `مرحباً ${pet.owner?.name || ""}، لقد عثرت على حيوانك الأليف ${pet.name} عبر مسح ميدالية ZAYA الذكية. أنا هنا للمساعدة في إعادته إليك.`
      : `مرحباً، قمت بمسح ميدالية ZAYA الخاصة بـ ${pet.name}. أردت الاطمئنان عليه.`;
  } else {
    whatsappText = pet.isLost
      ? `Bonjour ${pet.owner?.name || ""} ! J'ai retrouvé votre animal ${pet.name} grâce à sa médaille ZAYA. Je souhaite vous le restituer en toute sécurité.`
      : `Bonjour ! J'ai scanné la médaille ZAYA de ${pet.name} pour vous signaler que tout va bien.`;
  }

  const whatsappUrl = `https://wa.me/${cleanOwnerPhone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(whatsappText)}`;

  return {
    petName: pet.name,
    species: pet.species,
    breed: pet.breed || null,
    photoUrl: pet.photoUrl || null,
    approxAge,
    sex: pet.sex,
    color: pet.color || null,
    isLost: pet.isLost,
    lostNotes: pet.isLost ? pet.lostNotes : null,
    lostSince: pet.isLost && pet.lostSince ? new Date(pet.lostSince).toISOString() : null,
    ownerContact: {
      name: pet.owner?.name || "Propriétaire ZAYA",
      phone: cleanOwnerPhone,
      whatsappUrl,
    },
    emergencyContact: pet.emergencyPhone
      ? {
          name: pet.emergencyContact || "Contact d'Urgence",
          phone: pet.emergencyPhone,
        }
      : null,
    vetClinic: pet.vet
      ? {
          clinicName: pet.vet.clinicName,
          phone: pet.vet.emergencyPhone || pet.vet.phone,
          city: pet.vet.city,
        }
      : null,
    tagStatus: tag.status,
    tagToken: tag.token,
  };
}

export async function logSecurityAudit(params: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        details: params.details ? JSON.stringify(params.details) : null,
        ipAddress: params.ipAddress,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
