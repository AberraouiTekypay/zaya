export interface WhatsAppMessageParams {
  phone: string;
  petName: string;
  isLost: boolean;
  ownerName?: string;
  finderLocation?: string;
  finderPhone?: string;
  customMessage?: string;
  locale?: "fr" | "ar" | "en";
}

export function generateWhatsAppLink(params: WhatsAppMessageParams): string {
  // Normalize phone number to international format without + or spaces
  const cleanPhone = params.phone.replace(/[^\d]/g, "");

  let text = "";
  if (params.locale === "ar") {
    if (params.isLost) {
      text = `مرحباً ${params.ownerName || ""}، لقد عثرت على حيوانك الأليف ${params.petName} عبر مسح ميدالية ZAYA الذكية الخاصة به.`;
      if (params.finderLocation) {
        text += ` الموقع الحالي: ${params.finderLocation}.`;
      }
      text += ` يرجى التواصل معي للاطمئنان عليه.`;
    } else {
      text = `مرحباً، لقد قمت بمسح ميدالية ZAYA الخاصة بـ ${params.petName}. أود إعلامك بأن كل شيء على ما يرام.`;
    }
  } else {
    // French default
    if (params.isLost) {
      text = `Bonjour ${params.ownerName || ""} ! J'ai trouvé votre animal ${params.petName} grâce à sa médaille ZAYA.`;
      if (params.finderLocation) {
        text += ` Localisation : ${params.finderLocation}.`;
      }
      text += ` Merci de me contacter rapidement pour que vous puissiez le récupérer sain et sauf.`;
    } else {
      text = `Bonjour ! J'ai scanné la médaille ZAYA de ${params.petName}. Je voulais juste vous confirmer qu'il se porte bien !`;
    }
  }

  if (params.customMessage) {
    text += ` Note : "${params.customMessage}"`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export interface INotificationProvider {
  sendReminderNotification(params: {
    userId: string;
    phone?: string;
    email?: string;
    title: string;
    message: string;
    petName: string;
  }): Promise<{ success: boolean; channel: string }>;
}

export class NotificationService implements INotificationProvider {
  async sendReminderNotification(params: {
    userId: string;
    phone?: string;
    email?: string;
    title: string;
    message: string;
    petName: string;
  }): Promise<{ success: boolean; channel: string }> {
    // In production, triggers WhatsApp Cloud API or SMS provider (e.g. Infobip / Twilio)
    console.log(`[NotificationService] Sending reminder for ${params.petName} to ${params.phone || params.email}: ${params.title}`);
    return {
      success: true,
      channel: params.phone ? "WHATSAPP_READY" : "IN_APP",
    };
  }
}

export const notificationService = new NotificationService();
