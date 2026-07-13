import apiClient from '@/services/api.ts';
import type { LookupItem } from '@/features/product/types/product.types.ts';

export const homeService = {

  getTopBrands: async (limit: number | null): Promise<LookupItem[]> => {

    return apiClient.get('/lookups/get-top-brands', {

      params: {
        limit: limit,
      },
    });
  },
};
