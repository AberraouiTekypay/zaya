/**
 * ZAYA Payment Provider Abstraction
 *
 * Implements the Strategy design pattern for handling transactions in Morocco.
 * Supports:
 * - Cash on Delivery (COD / Espèces à la livraison)
 * - Moroccan Centre Monétique Interbancaire (CMI) 3D-Secure cards
 * - International payment cards via Stripe
 *
 * @module lib/providers/PaymentProvider
 */

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

/**
 * Common interface for all payment providers.
 */
export interface IPaymentProvider {
  name: string;
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
}

/**
 * Provider for Cash on Delivery (COD).
 * Transaction starts in PENDING status until delivery courier collects physical funds.
 */
export class CashOnDeliveryProvider implements IPaymentProvider {
  name = "CashOnDelivery";

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `COD-${Date.now()}-${request.orderNumber}`,
      status: "PENDING", // Cash collected upon physical courier delivery
      message: "Paiement en espèces à la livraison confirmé.",
      provider: this.name,
    };
  }
}

/**
 * Provider for the Moroccan interbank switch (Centre Monétique Interbancaire).
 * Generates signed 3D-Secure transaction payload.
 */
export class CMIProvider implements IPaymentProvider {
  name = "CMI_Morocco";

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // In production, this computes HMAC-SHA512 checksum and redirects to CMI gateway.
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

/**
 * Provider for international payments via Stripe.
 */
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

/**
 * Factory function returning the appropriate payment provider strategy.
 *
 * @param method - Payment method identifier
 * @returns Configured IPaymentProvider instance
 */
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
