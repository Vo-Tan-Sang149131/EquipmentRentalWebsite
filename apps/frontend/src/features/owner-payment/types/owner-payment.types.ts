export interface OwnerPayment {
  paymentId: number;
  orderId: number;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId: string;
  deviceName: string;
  renterName: string;
  paidAt: string;
  createdAt: string;
}

export interface OwnerPaymentStats {
  totalEarnings: number;
  pendingPayout: number;
  completedPayments: number;
  totalTransactions: number;
}
