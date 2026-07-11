import apiClient from '@/services/api';
import type { CheckoutRequest, CheckoutResponse } from '../types/order.types';

export const orderService = {
  getCheckout: async (payload: CheckoutRequest): Promise<CheckoutResponse> => {

    return apiClient.post('/orders/checkout', payload);
  },
};
