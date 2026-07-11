import apiClient from '@/services/api';
import type { OwnerPayment, OwnerPaymentStats } from '../types/owner-payment.types';

export const ownerPaymentService = {
  getMyPayments: (): Promise<OwnerPayment[]> =>
    apiClient.get('/orders/owner/payments'),

  getPaymentStats: (): Promise<OwnerPaymentStats> =>
    apiClient.get('/orders/owner/payment-stats'),
};
