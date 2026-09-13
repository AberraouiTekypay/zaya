export interface PaymentRequest {
  orderId: string;
  orderNumber: string;
  amountMAD: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  method: "CASH_ON_DELIVERY" | "CMI_CARD" | "STRIPE";
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  status: "PENDING" | "PAID" | "FAILED";
  message: string;
  provider: string;
  paymentUrl?: string;
}

export interface IPaymentProvider {
  name: string;
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
}

export class CashOnDeliveryProvider implements IPaymentProvider {
  name = "CashOnDelivery";

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `COD-${Date.now()}-${request.orderNumber}`,
      status: "PENDING", // Cash is collected upon physical delivery
      message: "Paiement en espèces à la livraison confirmé.",
      provider: this.name,
    };
  }
}

export class CMIProvider implements IPaymentProvider {
  name = "CMI_Morocco";

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // In production, this generates signed HMAC-SHA512 hash and redirects to CMI merchant portal.
    // Here we simulate successful 3D-Secure transaction for the MVP.
    const isMockSuccess = true;
    return {
      success: isMockSuccess,
      transactionId: `CMI-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      status: "PAID",
      message: "Paiement par carte bancaire validé avec succès par CMI 3D-Secure.",
      provider: this.name,
    };
  }
}

export class StripeProvider implements IPaymentProvider {
  name = "Stripe";

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `pi_${Date.now()}_test`,
      status: "PAID",
      message: "Stripe payment captured.",
      provider: this.name,
    };
  }
}

export function getPaymentProvider(method: string): IPaymentProvider {
  switch (method) {
    case "CMI_CARD":
      return new CMIProvider();
    case "STRIPE":
      return new StripeProvider();
    case "CASH_ON_DELIVERY":
    default:
      return new CashOnDeliveryProvider();
  }
}
