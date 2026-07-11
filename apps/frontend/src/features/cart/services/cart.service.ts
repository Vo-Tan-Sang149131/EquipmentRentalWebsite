import apiClient from '@/services/api';
import type { CartItemRequest, CartResponse } from '../types/cart.types';

export const cartService = {
  addToCart: async (payload: CartItemRequest): Promise<void> => {
    return apiClient.post('/cart/items', payload);
  },

  getMyCart: async (): Promise<CartResponse> => {
    return apiClient.get('/cart');
  },

  removeFromCart: async (cartItemId: number): Promise<void> => {
    return apiClient.delete(`/cart/items/${cartItemId}`);
  },
};
