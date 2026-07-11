import { useState, useCallback } from 'react';
import type { PaginationState } from '@/shared_components/types/pagination.types.ts';

interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
}

interface UsePaginationReturn extends PaginationState {
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  reset: () => void;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
}: UsePaginationProps = {}): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalPages] = useState(1);
  const [totalItems] = useState(0);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
  }, [initialPage, initialPageSize]);

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    handlePageChange,
    handlePageSizeChange,
    reset,
  };
}

// Helper function to update pagination state from API response
export function updatePaginationState(
  state: PaginationState,
  data: { totalElements: number; totalPages: number }
): PaginationState {
  return {
    ...state,
    totalItems: data.totalElements,
    totalPages: data.totalPages,
  };
}


