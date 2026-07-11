// @/features/product/services/product.service.ts
import apiClient from '@/services/api.ts';
import type { DeviceDetail, LookupItem, PriceRange, Product, SpringPageResponse } from '../types/product.types';

interface FetchProductsParams {
  page: number;
  size: number;
  keyword?: string;
  category?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortField?: string;
  sortDirection?: string;
}


export const productService = {
  getProducts: async (params: FetchProductsParams): Promise<SpringPageResponse<Product>> => {
    const backendSortBy = params.sortField === 'price' ? 'basePrice' : params.sortField;

    // Append brands to the query parameter if provided
    const brandsQueryParam = params.brands && params.brands.length > 0
      ? params.brands.join(',')
      : undefined;

    return apiClient.get('/products', {
      params: {
        page: params.page - 1,
        size: params.size,
        sortBy: backendSortBy,
        orderBy: params.sortDirection?.toUpperCase(),
        search: params.keyword,
        categoryName: params.category === 'All' ? undefined : params.category,
        brandNames: brandsQueryParam,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
      },
    });
  },

  getCategories: async (): Promise<LookupItem[]> => {
    return apiClient.get('/lookups/categories');
  },

  getBrands: async (): Promise<LookupItem[]> => {
    return apiClient.get('/lookups/brands');
  },

  getPriceRange: async (): Promise<PriceRange> => {
    return apiClient.get('/lookups/price-range');
  },

  getDeviceDetail: async (id: number | string): Promise<DeviceDetail> => {
    return apiClient.get(`/devices/${id}/detail`);
  },
};
