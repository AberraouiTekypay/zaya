export interface ShipmentRequest {
  orderId: string;
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  address: string;
  city: string;
  amountToCollectMAD: number; // For Cash On Delivery
  packageDescription: string;
}

export interface ShipmentResult {
  success: boolean;
  trackingNumber: string;
  courierName: string;
  estimatedDeliveryDate: string;
  trackingUrl: string;
}

export interface IDeliveryProvider {
  name: string;
  createShipment(request: ShipmentRequest): Promise<ShipmentResult>;
  getTrackingStatus(trackingNumber: string): Promise<string>;
}

export class MoroccanCourierProvider implements IDeliveryProvider {
  name = "Cathedis / Express Maroc";

  async createShipment(request: ShipmentRequest): Promise<ShipmentResult> {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const trackingNumber = `ZAYA-MA-${randomCode}`;
    
    // Delivery time: 24h for Casablanca/Rabat, 48h for others
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

export const defaultDeliveryProvider = new MoroccanCourierProvider();
