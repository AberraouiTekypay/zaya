import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting ZAYA seed data...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.petWeight.deleteMany();
  await prisma.petDocument.deleteMany();
  await prisma.petHealthRecord.deleteMany();
  await prisma.petTag.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.merchantProfile.deleteMany();
  await prisma.vetProfile.deleteMany();
  await prisma.user.deleteMany();

  // 1. Users
  const amine = await prisma.user.create({
    data: {
      id: "usr_amine_owner",
      email: "amine@zaya.ma",
      name: "Amine Berraoui",
      role: "OWNER",
      phone: "+212 661 12 34 56",
      city: "Casablanca",
      address: "14 Rue du Souvenir, Maarif, Casablanca",
      preferredLocale: "fr",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    },
  });

  const sarah = await prisma.user.create({
    data: {
      id: "usr_sarah_owner",
      email: "sarah@zaya.ma",
      name: "Sarah El Fassi",
      role: "OWNER",
      phone: "+212 662 98 76 54",
      city: "Rabat",
      address: "8 Avenue Hassan II, Agdal, Rabat",
      preferredLocale: "fr",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    },
  });

  const drBennaniUser = await prisma.user.create({
    data: {
      id: "usr_dr_bennani",
      email: "vet.anfa@zaya.ma",
      name: "Dr. Youssef Bennani",
      role: "VET",
      phone: "+212 522 36 40 00",
      city: "Casablanca",
      address: "Boulevard d'Anfa, Casablanca",
      preferredLocale: "fr",
    },
  });

  const drAlamiUser = await prisma.user.create({
    data: {
      id: "usr_dr_alami",
      email: "vet.agdal@zaya.ma",
      name: "Dr. Kenza Alami",
      role: "VET",
      phone: "+212 537 77 88 99",
      city: "Rabat",
      address: "Avenue Fal Ould Oumeir, Agdal, Rabat",
      preferredLocale: "fr",
    },
  });

  const merchantUser = await prisma.user.create({
    data: {
      id: "usr_merchant_atlas",
      email: "contact@atlaspet.ma",
      name: "Atlas Pet Supply",
      role: "MERCHANT",
      phone: "+212 522 25 10 20",
      city: "Casablanca",
      address: "Bd Ghandi, Casablanca",
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      id: "usr_admin_zaya",
      email: "admin@zaya.ma",
      name: "ZAYA Administrateur",
      role: "ADMIN",
      phone: "+212 661 00 00 00",
      city: "Casablanca",
    },
  });

  // 2. Vet Profiles
  const vetAnfa = await prisma.vetProfile.create({
    data: {
      id: "vet_anfa_casablanca",
      userId: drBennaniUser.id,
      clinicName: "Clinique Vétérinaire d'Anfa",
      licenseNumber: "ONVM-1082-CAS",
      phone: "+212 522 36 40 00",
      emergencyPhone: "+212 661 44 55 66",
      city: "Casablanca",
      address: "87 Boulevard d'Anfa, Casablanca",
      openingHours: "Lun - Sam : 08:30 - 20:00 (Urgences 24/7)",
      bio: "Clinique moderne équipée pour la médecine féline et canine, chirurgie, imagerie numérique et soins préventifs.",
      verified: true,
    },
  });

  const vetAgdal = await prisma.vetProfile.create({
    data: {
      id: "vet_agdal_rabat",
      userId: drAlamiUser.id,
      clinicName: "Cabinet Vétérinaire Agdal Rabat",
      licenseNumber: "ONVM-2041-RAB",
      phone: "+212 537 77 88 99",
      emergencyPhone: "+212 662 11 22 33",
      city: "Rabat",
      address: "24 Avenue Fal Ould Oumeir, Agdal, Rabat",
      openingHours: "Lun - Ven : 09:00 - 19:30, Sam : 09:00 - 14:00",
      bio: "Prise en charge personnalisée de la santé animale, vaccinations, bilans et suivi nutritionnel.",
      verified: true,
    },
  });

  // 3. Merchant Profile
  const merchantProfile = await prisma.merchantProfile.create({
    data: {
      id: "mer_atlas_casa",
      userId: merchantUser.id,
      storeName: "Atlas Pet Boutique Casablanca",
      description: "Distributeur agréé d'alimentation premium, accessoires et soins pour animaux au Maroc.",
      city: "Casablanca",
      address: "128 Boulevard Ghandi, Casablanca",
      phone: "+212 522 25 10 20",
      verified: true,
    },
  });

  // 4. Categories
  const catAlim = await prisma.productCategory.create({
    data: {
      id: "cat_alim",
      slug: "alimentation",
      nameFr: "Alimentation",
      nameAr: "الأغذية والأطعمة",
      nameEn: "Food & Nutrition",
      descriptionFr: "Croquettes, pâtées et friandises premium adaptées aux besoins de votre animal.",
      descriptionAr: "أطعمة مجففة ورطبة ومكافآت ممتازة لصحة حيوانك.",
      icon: "Utensils",
    },
  });

  const catHygiene = await prisma.productCategory.create({
    data: {
      id: "cat_hygiene",
      slug: "hygiene-litiere",
      nameFr: "Hygiène & Litières",
      nameAr: "النظافة والفرش",
      nameEn: "Hygiene & Litter",
      descriptionFr: "Litières agglomérantes, shampoings doux et produits de propreté.",
      descriptionAr: "فرش متكتل، شامبو لطيف ومنتجات النظافة اليومية.",
      icon: "Sparkles",
    },
  });

  const catSante = await prisma.productCategory.create({
    data: {
      id: "cat_sante",
      slug: "sante-antiparasitaires",
      nameFr: "Santé & Antiparasitaires",
      nameAr: "الصحة ومضادات الطفيليات",
      nameEn: "Health & Parasite Control",
      descriptionFr: "Traitements anti-puces, tiques, vermifuges et compléments alimentaires.",
      descriptionAr: "علاجات البراغيث والقراد والديدان والمكملات الغذائية.",
      icon: "HeartPulse",
    },
  });

  const catAccessoires = await prisma.productCategory.create({
    data: {
      id: "cat_accessoires",
      slug: "accessoires-confort",
      nameFr: "Accessoires & Médailles",
      nameAr: "الإكسسوارات والميداليات",
      nameEn: "Accessories & Tags",
      descriptionFr: "Médailles ZAYA NFC, colliers, laisses, couchages et gamelles.",
      descriptionAr: "ميداليات زايا الذكية، أطواق، أسرّة وأوعية طعام.",
      icon: "Tag",
    },
  });

  const catJouets = await prisma.productCategory.create({
    data: {
      id: "cat_jouets",
      slug: "jouets-eveil",
      nameFr: "Jouets & Éveil",
      nameAr: "الألعاب والتسلية",
      nameEn: "Toys & Play",
      descriptionFr: "Jouets interactifs, griffoirs et balles résistantes.",
      descriptionAr: "ألعاب تفاعلية ومحفزة لنشاط حيوانك.",
      icon: "Gamepad2",
    },
  });

  // 5. Products
  const prodTagZaya = await prisma.product.create({
    data: {
      id: "prod_zaya_tag",
      slug: "medaille-zaya-nfc-inox",
      nameFr: "Médaille ZAYA NFC + QR Code Intelligente (Inox Brossé)",
      nameAr: "ميدالية زايا الذكية بتقنية NFC ورمز QR (فولاذ مقاوم للصدأ)",
      nameEn: "ZAYA Smart NFC + QR Pet Tag (Brushed Steel)",
      descriptionFr: "La médaille connectée officielle ZAYA. Sans abonnement obligatoire, étanche IP68, gravure laser inaltérable. Connecte votre animal en un scan ou tap sans application nécessaire pour le trouveur.",
      descriptionAr: "الميدالية الذكية الرسمية من زايا. مقاومة للماء والغبار، نقش ليزري دائم، تتيح الاتصال المباشر بك عبر واتساب أو الهاتف عند مسحها دون الحاجة لأي تطبيق.",
      descriptionEn: "Official ZAYA connected tag. Waterproof IP68, laser engraved, connects to pet profile instantly upon NFC tap or QR scan.",
      priceMAD: 79.0,
      compareAtPriceMAD: 120.0,
      stock: 250,
      targetSpecies: "ALL",
      imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop&q=80",
      isRecurringEligible: false,
      badge: "Essentiel",
      categoryId: catAccessoires.id,
      merchantId: merchantProfile.id,
      rating: 5.0,
      reviewsCount: 142,
    },
  });

  const prodRoyalCaninChat = await prisma.product.create({
    data: {
      id: "prod_rc_british",
      slug: "royal-canin-british-shorthair-4kg",
      nameFr: "Royal Canin British Shorthair Adult 4kg",
      nameAr: "رويال كانين قطط بريتيش شورت هير 4 كغ",
      nameEn: "Royal Canin British Shorthair Adult 4kg",
      descriptionFr: "Formulé spécifiquement pour soutenir le tonus musculaire et les articulations des chats de race British Shorthair. Croquettes exclusives en forme de croissant adaptées à leur mâchoire robuste.",
      descriptionAr: "تركيبة مخصصة لدعم العضلات والمفاصل لقطط البريتيش شورت هير. حبيبات طعام بشكل هلالي لتناسب فكها المميز.",
      descriptionEn: "Tailored nutrition to support muscle mass and joint health for adult British Shorthair cats.",
      priceMAD: 349.0,
      compareAtPriceMAD: 389.0,
      stock: 45,
      targetSpecies: "CAT",
      imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=80",
      isRecurringEligible: true,
      defaultIntervalDays: 30,
      badge: "Recommandé Vétérinaire",
      categoryId: catAlim.id,
      merchantId: merchantProfile.id,
      rating: 4.9,
      reviewsCount: 56,
    },
  });

  const prodRoyalCaninChien = await prisma.product.create({
    data: {
      id: "prod_rc_medium_adult",
      slug: "royal-canin-medium-adult-15kg",
      nameFr: "Royal Canin Medium Adult 15kg",
      nameAr: "رويال كانين للكلاب المتوسطة البالغة 15 كغ",
      nameEn: "Royal Canin Medium Adult 15kg",
      descriptionFr: "Aliment complet pour chiens adultes de taille moyenne (11 à 25 kg). Aide à maintenir les défenses naturelles et favorise une digestion optimale grâce à des fibres équilibrées.",
      descriptionAr: "طعام متكامل للكلاب البالغة متوسطة الحجم (11 إلى 25 كغ). يعزز المناعة الطبيعية ويسهل الهضم.",
      descriptionEn: "Complete food for medium breed adult dogs (11 to 25 kg) ensuring optimal vitality and digestive health.",
      priceMAD: 680.0,
      compareAtPriceMAD: 750.0,
      stock: 30,
      targetSpecies: "DOG",
      imageUrl: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800&auto=format&fit=crop&q=80",
      isRecurringEligible: true,
      defaultIntervalDays: 30,
      badge: "Bestseller",
      categoryId: catAlim.id,
      merchantId: merchantProfile.id,
      rating: 4.8,
      reviewsCount: 89,
    },
  });

  const prodBravecto = await prisma.product.create({
    data: {
      id: "prod_bravecto_chien",
      slug: "bravecto-comprime-chien-10-20kg",
      nameFr: "Bravecto Chien (10-20 kg) - 1 Comprimé à Croquer",
      nameAr: "برافيكتو أقراص للكلاب (10-20 كغ) - حماية 3 أشهر",
      nameEn: "Bravecto Chewable Tablet for Dogs (10-20 kg) - 3 Months Protection",
      descriptionFr: "Comprimé à croquer savoureux offrant 12 semaines de protection continue contre les puces et les tiques chez le chien. Efficacité prouvée et sécurité clinique.",
      descriptionAr: "قرص مضغ لذيذ يوفر 12 أسبوعاً كاملاً من الحماية ضد البراغيث والقراد للكلاب.",
      descriptionEn: "Tasty chewable tablet providing 12 full weeks of continuous flea and tick protection.",
      priceMAD: 320.0,
      compareAtPriceMAD: 350.0,
      stock: 60,
      targetSpecies: "DOG",
      imageUrl: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&auto=format&fit=crop&q=80",
      isRecurringEligible: true,
      defaultIntervalDays: 90,
      badge: "Protection 3 Mois",
      categoryId: catSante.id,
      merchantId: merchantProfile.id,
      rating: 5.0,
      reviewsCount: 73,
    },
  });

  const prodLitiere = await prisma.product.create({
    data: {
      id: "prod_litiere_purewhite",
      slug: "litiere-pure-white-bentonite-10l",
      nameFr: "Litière Agglomérante Pure White Ultra 10L",
      nameAr: "رمل قطط فائق التكتل بيور وايت 10 لتر",
      nameEn: "Pure White Ultra Clumping Cat Litter 10L",
      descriptionFr: "Bentonite blanche naturelle 100% sans poussière avec contrôle renforcé des odeurs. Agglomérats instantanés faciles à retirer, économique et douce pour les coussinets.",
      descriptionAr: "بنتونيت أبيض طبيعي خالٍ من الغبار بنسبة 100% مع تحكم فائق في الروائح وتكتل سريع وسهل التنظيف.",
      descriptionEn: "Natural white bentonite, 99.9% dust-free, instant clumping with superior odor lock.",
      priceMAD: 89.0,
      compareAtPriceMAD: 110.0,
      stock: 80,
      targetSpecies: "CAT",
      imageUrl: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=800&auto=format&fit=crop&q=80",
      isRecurringEligible: true,
      defaultIntervalDays: 21,
      badge: "Super Éco",
      categoryId: catHygiene.id,
      merchantId: merchantProfile.id,
      rating: 4.7,
      reviewsCount: 34,
    },
  });

  // 6. Pets & Tags
  // Pet 1: Luna (Cat, Owner Amine, Vet Dr. Bennani)
  const luna = await prisma.pet.create({
    data: {
      id: "pet_luna_casablanca",
      name: "Luna",
      species: "CAT",
      breed: "British Shorthair",
      birthDate: new Date("2023-04-10"),
      sex: "FEMALE",
      color: "Gris argenté / Silver Grey",
      microchipNumber: "604098100234567",
      photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80",
      notes: "Chatte d'intérieur très calme. Sensible aux changements de croquettes. Carnet de santé à jour.",
      isLost: false,
      ownerId: amine.id,
      vetId: vetAnfa.id,
      emergencyContact: "Yassine Berraoui (Frère)",
      emergencyPhone: "+212 663 44 55 66",
    },
  });

  await prisma.petTag.create({
    data: {
      id: "tag_luna",
      code: "ZY-CAS-101",
      token: "luna_sec_7891",
      status: "ACTIVE",
      petId: luna.id,
      activatedAt: new Date("2024-01-15"),
      scanCount: 14,
      lastScannedAt: new Date(),
    },
  });

  // Luna's Health Records
  await prisma.petHealthRecord.create({
    data: {
      petId: luna.id,
      type: "VACCINATION",
      title: "Vaccin Purevax RCP + Rage",
      description: "Rappel annuel contre le coryza, typhus, chlamydiose et la rage.",
      dateAdministered: new Date("2025-09-25"),
      nextDueDate: new Date("2026-09-25"),
      providerName: "Clinique Vétérinaire d'Anfa (Dr. Bennani)",
      batchNumber: "FR-VACC-88291-B",
    },
  });

  await prisma.petHealthRecord.create({
    data: {
      petId: luna.id,
      type: "DEWORMING",
      title: "Milbemax Chat Vermifuge",
      description: "Traitement vermifuge large spectre comprimé appétent.",
      dateAdministered: new Date("2026-07-10"),
      nextDueDate: new Date("2026-10-10"),
      providerName: "Clinique Vétérinaire d'Anfa",
    },
  });

  await prisma.petHealthRecord.create({
    data: {
      petId: luna.id,
      type: "FLEA_TICK",
      title: "Stronghold Plus Chat Spot-on",
      description: "Protection anti-puces, tiques et acariens auriculaires.",
      dateAdministered: new Date("2026-08-20"),
      nextDueDate: new Date("2026-09-20"),
      providerName: "Dr. Youssef Bennani",
    },
  });

  // Luna's Weights
  await prisma.petWeight.createMany({
    data: [
      { petId: luna.id, weightKg: 3.9, recordedAt: new Date("2025-09-25"), notes: "Visite annuelle" },
      { petId: luna.id, weightKg: 4.1, recordedAt: new Date("2026-03-12"), notes: "Poids idéal stable" },
      { petId: luna.id, weightKg: 4.25, recordedAt: new Date("2026-08-20"), notes: "Bonne masse musculaire" },
    ],
  });

  // Luna's Reminders
  await prisma.reminder.create({
    data: {
      petId: luna.id,
      ownerId: amine.id,
      title: "Rappel Vaccin Annuel (Purevax + Rage)",
      type: "VACCINATION",
      dueDate: new Date("2026-09-25"),
      recurrence: "YEARLY",
      status: "PENDING",
      notes: "Prendre rendez-vous chez Dr. Bennani à la clinique d'Anfa.",
    },
  });

  await prisma.reminder.create({
    data: {
      petId: luna.id,
      ownerId: amine.id,
      title: "Pipette anti-puces Stronghold Plus",
      type: "FLEA_TICK",
      dueDate: new Date("2026-09-20"),
      recurrence: "EVERY_30_DAYS",
      status: "PENDING",
      notes: "Appliquer sur la nuque le soir.",
    },
  });

  await prisma.reminder.create({
    data: {
      petId: luna.id,
      ownerId: amine.id,
      title: "Recommander les croquettes Royal Canin British Shorthair",
      type: "FOOD_REORDER",
      dueDate: new Date("2026-09-28"),
      recurrence: "EVERY_30_DAYS",
      status: "PENDING",
      notes: "Sac de 4kg restant pour environ 7 jours.",
    },
  });

  // Luna's active subscription
  await prisma.subscription.create({
    data: {
      id: "sub_luna_food",
      userId: amine.id,
      petId: luna.id,
      productId: prodRoyalCaninChat.id,
      quantity: 1,
      unitPriceMAD: 331.55, // 5% subscriber discount
      intervalDays: 30,
      nextDeliveryDate: new Date("2026-09-28"),
      status: "ACTIVE",
      deliveryAddress: "14 Rue du Souvenir, Maarif",
      city: "Casablanca",
      phone: "+212 661 12 34 56",
    },
  });

  // Pet 2: Max (German Shepherd in Rabat, LOST MODE ACTIVE for demonstration!)
  const max = await prisma.pet.create({
    data: {
      id: "pet_max_rabat",
      name: "Max",
      species: "DOG",
      breed: "Berger Allemand",
      birthDate: new Date("2022-06-15"),
      sex: "MALE",
      color: "Noir et fauve / Black & Tan",
      microchipNumber: "604098100876543",
      photoUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&auto=format&fit=crop&q=80",
      notes: "Chien très sociable et affectueux. Aime les enfants. Porte un collier en cuir avec sa médaille ZAYA.",
      isLost: true, // LOST PET ACTIVE!
      lostNotes: "PERDU le 12 Septembre près de la forêt Hilton / Agdal à Rabat. Chien très amical, répond à son nom 'Max'. Il a besoin de boire et a peur des klaxons.",
      lostSince: new Date("2026-09-12T14:30:00Z"),
      ownerId: sarah.id,
      vetId: vetAgdal.id,
      emergencyContact: "Karim El Fassi (+212 663 88 99 00)",
      emergencyPhone: "+212 663 88 99 00",
    },
  });

  await prisma.petTag.create({
    data: {
      id: "tag_max",
      code: "ZY-RAB-204",
      token: "max_lost_demo_9921",
      status: "ACTIVE",
      petId: max.id,
      activatedAt: new Date("2023-11-20"),
      scanCount: 31,
      lastScannedAt: new Date(),
    },
  });

  await prisma.petHealthRecord.create({
    data: {
      petId: max.id,
      type: "VACCINATION",
      title: "Vaccin Nobivac DHPPi + L4 + Rage",
      description: "Vaccination complète annuelle chien de race.",
      dateAdministered: new Date("2026-02-14"),
      nextDueDate: new Date("2027-02-14"),
      providerName: "Cabinet Vétérinaire Agdal Rabat",
      batchNumber: "MA-RAB-4410",
    },
  });

  // Pet 3: Milo (Golden Retriever in Casablanca, Safe)
  const milo = await prisma.pet.create({
    data: {
      id: "pet_milo_casablanca",
      name: "Milo",
      species: "DOG",
      breed: "Golden Retriever",
      birthDate: new Date("2024-02-01"),
      sex: "MALE",
      color: "Doré clair / Light Golden",
      microchipNumber: "604098100998877",
      photoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80",
      notes: "Jeune chien plein d'énergie, adore l'eau et nager sur la plage de Ain Diab.",
      isLost: false,
      ownerId: amine.id,
      vetId: vetAnfa.id,
      emergencyContact: "Yassine Berraoui",
      emergencyPhone: "+212 663 44 55 66",
    },
  });

  await prisma.petTag.create({
    data: {
      id: "tag_milo",
      code: "ZY-CAS-305",
      token: "milo_sec_3342",
      status: "ACTIVE",
      petId: milo.id,
      activatedAt: new Date("2024-04-10"),
      scanCount: 5,
      lastScannedAt: new Date(),
    },
  });

  // 7. Seed Order
  const seedOrder = await prisma.order.create({
    data: {
      id: "ord_past_001",
      orderNumber: "ZAYA-ORD-10482",
      userId: amine.id,
      totalMAD: 453.0,
      subtotalMAD: 428.0,
      deliveryFeeMAD: 25.0,
      paymentMethod: "CASH_ON_DELIVERY",
      paymentStatus: "PAID",
      deliveryStatus: "DELIVERED",
      trackingNumber: "ZAYA-MA-78211",
      deliveryAddress: "14 Rue du Souvenir, Maarif",
      city: "Casablanca",
      phone: "+212 661 12 34 56",
      items: {
        create: [
          {
            productId: prodRoyalCaninChat.id,
            quantity: 1,
            unitPriceMAD: 349.0,
            totalPriceMAD: 349.0,
          },
          {
            productId: prodTagZaya.id,
            quantity: 1,
            unitPriceMAD: 79.0,
            totalPriceMAD: 79.0,
          },
        ],
      },
    },
  });

  console.log("✅ ZAYA seed data populated successfully!");
  console.log(`- 6 Users (Amine, Sarah, Dr. Bennani, Dr. Alami, Merchant Atlas, Admin)`);
  console.log(`- 2 Vet Clinics (Anfa Casablanca, Agdal Rabat)`);
  console.log(`- 5 Categories & 5 Products in MAD`);
  console.log(`- 3 Pets:`);
  console.log(`  • Luna (Cat, Casablanca, Token: luna_sec_7891)`);
  console.log(`  • Max (Dog, Rabat, Token: max_lost_demo_9921 - LOST MODE ACTIVE)`);
  console.log(`  • Milo (Dog, Casablanca, Token: milo_sec_3342)`);
  console.log(`- 1 Completed Order (ZAYA-ORD-10482) & 1 Active Subscription`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
