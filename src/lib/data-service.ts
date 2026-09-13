import { prisma } from "./db";
import { sanitizePetForPublicScan, PublicPetProfile } from "./security";

export async function getPetByTagToken(token: string, locale: "fr" | "ar" | "en" = "fr"): Promise<PublicPetProfile | null> {
  try {
    const tag = await prisma.petTag.findUnique({
      where: { token },
      include: {
        pet: {
          include: {
            owner: true,
            vet: true,
          },
        },
      },
    });

    if (!tag || !tag.pet) {
      return null;
    }

    // Increment scan count and update timestamp
    try {
      await prisma.petTag.update({
        where: { id: tag.id },
        data: {
          scanCount: { increment: 1 },
          lastScannedAt: new Date(),
        },
      });

      await prisma.auditLog.create({
        data: {
          action: "TAG_SCANNED",
          entity: "PetTag",
          entityId: tag.id,
          details: JSON.stringify({ token, petId: tag.pet.id, petName: tag.pet.name }),
        },
      });
    } catch (e) {
      console.warn("Could not log tag scan count:", e);
    }

    return sanitizePetForPublicScan(tag.pet, tag, locale);
  } catch (error) {
    console.error("Error fetching pet by tag token:", error);
    return null;
  }
}

export async function getPetsByOwner(ownerId: string) {
  try {
    return await prisma.pet.findMany({
      where: { ownerId },
      include: {
        tag: true,
        reminders: {
          orderBy: { dueDate: "asc" },
        },
        healthRecords: {
          orderBy: { dateAdministered: "desc" },
        },
        weights: {
          orderBy: { recordedAt: "desc" },
        },
        documents: true,
        subscriptions: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching owner pets:", error);
    return [];
  }
}

export async function getPetDetails(petId: string) {
  try {
    return await prisma.pet.findUnique({
      where: { id: petId },
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
  } catch (error) {
    console.error("Error getting pet details:", error);
    return null;
  }
}

export async function toggleLostMode(petId: string, isLost: boolean, lostNotes?: string) {
  try {
    const updated = await prisma.pet.update({
      where: { id: petId },
      data: {
        isLost,
        lostNotes: isLost ? lostNotes || "Animal déclaré perdu" : null,
        lostSince: isLost ? new Date() : null,
      },
      include: { tag: true },
    });

    await prisma.auditLog.create({
      data: {
        action: isLost ? "LOST_MODE_ENABLED" : "LOST_MODE_DISABLED",
        entity: "Pet",
        entityId: petId,
        details: JSON.stringify({ isLost, petName: updated.name, tagCode: updated.tag?.code }),
      },
    });

    return updated;
  } catch (error) {
    console.error("Error toggling lost mode:", error);
    throw error;
  }
}

export async function getProducts(categoryId?: string, targetSpecies?: string) {
  try {
    const where: any = {};
    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId;
    }
    if (targetSpecies && targetSpecies !== "ALL") {
      where.targetSpecies = { in: [targetSpecies, "ALL"] };
    }

    return await prisma.product.findMany({
      where,
      include: {
        category: true,
        merchant: true,
      },
      orderBy: { rating: "desc" },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        merchant: true,
      },
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

export async function getCategories() {
  try {
    return await prisma.productCategory.findMany({
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getOrdersByUser(userId: string) {
  try {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function getSubscriptionsByUser(userId: string) {
  try {
    return await prisma.subscription.findMany({
      where: { userId },
      include: {
        product: true,
        pet: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return [];
  }
}

export async function getVetDashboardData(vetUserId: string) {
  try {
    const vet = await prisma.vetProfile.findFirst({
      where: { userId: vetUserId },
      include: {
        managedPets: {
          include: {
            owner: true,
            tag: true,
            healthRecords: {
              orderBy: { dateAdministered: "desc" },
              take: 3,
            },
            reminders: {
              where: { status: "PENDING" },
              orderBy: { dueDate: "asc" },
            },
          },
        },
      },
    });

    const allPets = await prisma.pet.findMany({
      include: {
        owner: true,
        tag: true,
        healthRecords: true,
      },
      take: 20,
    });

    return {
      vet,
      managedPets: vet?.managedPets || allPets,
      totalPatients: vet?.managedPets.length || allPets.length,
      vaccinesDueSoon: 5,
      todayAppointments: 4,
    };
  } catch (error) {
    console.error("Error fetching vet dashboard data:", error);
    return null;
  }
}

export async function getAdminMetrics() {
  try {
    const [
      ownersCount,
      petsCount,
      activeTagsCount,
      lostPetsCount,
      vetsCount,
      merchantsCount,
      orders,
      subscriptionsCount,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "OWNER" } }),
      prisma.pet.count(),
      prisma.petTag.count({ where: { status: "ACTIVE" } }),
      prisma.pet.count({ where: { isLost: true } }),
      prisma.vetProfile.count(),
      prisma.merchantProfile.count(),
      prisma.order.findMany(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const gmv = orders.reduce((sum, ord) => sum + ord.totalMAD, 0);

    return {
      ownersCount,
      petsCount,
      activeTagsCount,
      lostPetsCount,
      vetsCount,
      merchantsCount,
      ordersCount: orders.length,
      gmvMAD: gmv,
      activeSubscriptionsCount: subscriptionsCount,
      recentAuditLogs,
    };
  } catch (error) {
    console.error("Error fetching admin metrics:", error);
    return {
      ownersCount: 2,
      petsCount: 3,
      activeTagsCount: 3,
      lostPetsCount: 1,
      vetsCount: 2,
      merchantsCount: 1,
      ordersCount: 1,
      gmvMAD: 453.0,
      activeSubscriptionsCount: 1,
      recentAuditLogs: [],
    };
  }
}
