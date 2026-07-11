export type PaymentMethod = 'VNPAY' | 'MOMO' | 'BANK_TRANSFER' | 'CASH';


export interface CheckoutRequest {
  cartItemIds: number[];
  paymentMethod: PaymentMethod;
}

export interface CheckoutResponse {
  orderId: number;
  totalPrice: number;
  paymentUrl: string;
  paymentToken: string;
}
