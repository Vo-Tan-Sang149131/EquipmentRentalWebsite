// @/features/product/hooks/useProducts.ts
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import { DEFAULT_PRICE_RANGE, ITEMS_PER_PAGE } from '../constants/defaultValues';
import type { Product, SpringPageResponse } from '../types/product.types';

export function useProductFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  // --- 1. Synchronize State with URL Params ---
  const searchQuery = searchParams.get('keyword') || '';
  const currentPage = Number(searchParams.get('page')) || 1;
  const selectedCategory = searchParams.get('category') || 'All';

  const selectedBrands = useMemo(() => {
    const brandsRaw = searchParams.get('brands');
    return brandsRaw ? brandsRaw.split(',') : [];
  }, [searchParams]);

  const priceRange = useMemo<[number, number]>(() => {
    const min = searchParams.get('minPrice');
    const max = searchParams.get('maxPrice');
    return min && max ? [Number(min), Number(max)] : DEFAULT_PRICE_RANGE;
  }, [searchParams]);

  const sortField = (searchParams.get('sortField') as 'name' | 'price') || 'price';
  const sortDirection = (searchParams.get('sortDirection') as 'asc' | 'desc') || 'asc';

  // --- 2. Helper method to update URL Params ---
  const updateParams = (updates: Record<string, string | string[] | null>) => {
    setSearchParams((prev) => {
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === 'All' || value === '') {
          prev.delete(key);
        } else if (Array.isArray(value)) {
          if (value.length === 0) prev.delete(key);
          else prev.set(key, value.join(','));
        } else {
          prev.set(key, value);
        }
      });
      if (!('page' in updates)) { // If the user changes filter criteria, reset to page 1
        prev.set('page', '1');
      }
      return prev;
    });
  };

  // --- 3. Dispatchers interactive with UI --
  const setSearchQuery = (keyword: string) => updateParams({ keyword });
  const setCurrentPage = (page: number) => updateParams({ page: page.toString() });
  const setSelectedCategory = (category: string) => updateParams({ category, minPrice: null, maxPrice: null });
  const setSelectedBrands = (brands: string[]) => updateParams({ brands });
  const setSortField = (field: 'name' | 'price') => updateParams({ sortField: field });
  const setPriceRange = (range: [number, number]) => {
    updateParams({ minPrice: range[0].toString(), maxPrice: range[1].toString() });
  };
  const toggleSortDirection = () => {
    updateParams({ sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' });
  };
  const resetFilters = () => setSearchParams({});

  // --- 4. Call API through tanstack/react-query ---
  const { data, isLoading, isError } = useQuery<SpringPageResponse<Product>>({
    queryKey: ['products', searchQuery, currentPage, selectedCategory, selectedBrands, priceRange, sortField, sortDirection],
    queryFn: () => productService.getProducts({
      page: currentPage,
      size: ITEMS_PER_PAGE,
      keyword: searchQuery,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      brands: selectedBrands.length > 0 ? selectedBrands : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortField,
      sortDirection,
    }),
    placeholderData: keepPreviousData, // Keep previous data while loading new data
  });

  return {
    selectedCategory, setSelectedCategory,
    selectedBrands, setSelectedBrands,
    priceRange, setPriceRange,
    searchQuery, setSearchQuery,
    resetFilters,
    sortField, setSortField,
    sortDirection, toggleSortDirection,
    currentPage, setCurrentPage,

    paginatedProducts: data?.content || [],
    filteredProducts: { length: data?.totalElements || 0 },
    totalPages: data?.totalPages || 1,
    isLoading,
    isError,
  };
}
