/**
 * ZAYA Delivery & Moroccan Logistics Provider
 *
 * Models package creation, waybill generation, tracking ID allocation,
 * and delivery timeline estimation with domestic Moroccan logistics networks
 * (Cathedis, Express Maroc, Amana).
 *
 * @module lib/providers/DeliveryProvider
 */

export interface ShipmentRequest {
  orderId: string;
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  address: string;
  city: string;
  amountToCollectMAD: number; // Required for Cash On Delivery reconciliation
  packageDescription: string;
}

export interface ShipmentResult {
  success: boolean;
  trackingNumber: string;
  courierName: string;
  estimatedDeliveryDate: string;
  trackingUrl: string;
}

/**
 * Interface defining logistics courier interactions.
 */
export interface IDeliveryProvider {
  name: string;
  createShipment(request: ShipmentRequest): Promise<ShipmentResult>;
  getTrackingStatus(trackingNumber: string): Promise<string>;
}

/**
 * Implementation for Moroccan national parcel delivery networks.
 * Delivers in 24 hours within major urban centers (Casablanca, Rabat, Mohammedia)
 * and 48 hours for other Moroccan regions.
 */
export class MoroccanCourierProvider implements IDeliveryProvider {
  name = "Cathedis / Express Maroc";

  async createShipment(request: ShipmentRequest): Promise<ShipmentResult> {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const trackingNumber = `ZAYA-MA-${randomCode}`;
    
    // Delivery SLA: 24h for Casablanca/Rabat, 48h for regional cities
    const isMajorHub = ["Casablanca", "Rabat", "Mohammedia"].includes(request.city);
    const daysToAdd = isMajorHub ? 1 : 2;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + daysToAdd);

    return {
      success: true,
      trackingNumber,
      courierName: this.name,
      estimatedDeliveryDate: estDate.toISOString().split("T")[0],
      trackingUrl: `/app/orders?tracking=${trackingNumber}`,
    };
  }

  async getTrackingStatus(trackingNumber: string): Promise<string> {
    return "DISPATCHED";
  }
}

/**
 * Default shared logistics provider instance.
 */
export const defaultDeliveryProvider = new MoroccanCourierProvider();
