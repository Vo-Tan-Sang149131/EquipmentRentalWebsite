export interface InvoiceItem {
  deviceId: number;
  deviceName: string;
  pricePerDay: number;
  rentalDays: number;
  subtotal: number;
  depositAmount: number;
}

export interface InvoicePayment {
  paymentId: number;
  paymentMethod: string;
  amount: number;
  status: string;
  paidAt: string;
}

export interface InvoiceResponse {
  orderId: number;
  orderStatus: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  items: InvoiceItem[];
  payments: InvoicePayment[];
  createdAt: string;
}
