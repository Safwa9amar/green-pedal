export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type Station = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  bikesAvailable: number;
};

export type Bike = {
  id: string;
  qrCode: string;
  status: "AVAILABLE" | "IN_USE" | "MAINTENANCE";
  batteryLevel: number;
  stationId: string | null;
  stationName?: string;
};

export type Rental = {
  id: string;
  userId: string;
  bikeId: string;
  startTime: Date;
  endTime: Date | null;
  cost: number | null;
  status: "ACTIVE" | "COMPLETED";
  userName: string;
};

export type Stat = {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  changeType?: "increase" | "decrease";
};

export type StationFormData = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
};

export interface ChargilyWebhookEvent {
  id: string;
  entity: "event";
  livemode: boolean | string; // sometimes Chargily sends it as string
  type: "checkout.paid" | "checkout.failed" | string;
  data: CheckoutData;
  created_at: number;
  updated_at: number;
}

export interface CheckoutData {
  id: string;
  entity: "checkout";
  fees: number;
  amount: number;
  locale: "ar" | "fr" | "en" | string;
  status: "paid" | "pending" | "failed" | string;
  metadata: Record<string, any> | null;
  created_at: number;
  updated_at: number;
  invoice_id: string | null;
  customer_id: string;
  description: string | null;
  failure_url: string | null;
  success_url: string | null;
  payment_method: string;
  payment_link_id: string | null;
  pass_fees_to_customer: boolean | null;
  chargily_pay_fees_allocation: "customer" | "merchant" | string | null;
  shipping_address: ShippingAddress | null;
  collect_shipping_address: boolean | number;
  discount: number | null;
  amount_without_discount: number | null;
  url: string;
}

export interface ShippingAddress {
  state?: string;
  address?: string;
  country?: string;
  city?: string;
  zip?: string;
}
