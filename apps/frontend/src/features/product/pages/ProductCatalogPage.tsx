import { Fragment, useState } from 'react';
import { ProductFilters } from '@/features/product/components/ProductFilters.tsx';
import ProductGrid from '@/features/product/components/ProductGrid.tsx';
import { ProductSort } from '@/features/product/components/ProductSort.tsx';
import Sidebar from '@/components/layout/Sidebar.tsx';
import BackToTop from '@/components/layout/BackToTop.tsx';
import Pagination from '@/features/product/components/Pagination.tsx';
import { useProductFilter } from '@/features/product/hooks/useProducts.ts';
import EmptyState from '@/features/product/components/EmptyState.tsx';
import { NOT_FOUND_MESSAGE, NOT_FOUND_TITLE } from '@/features/product/constants/defaultValues.ts';
import { Filter, X } from 'lucide-react';

export default function ProductCatalogPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {
    selectedCategory, setSelectedCategory,
    selectedBrands, setSelectedBrands,
    priceRange, setPriceRange,
    paginatedProducts,
    filteredProducts,
    resetFilters,
    sortField, setSortField,
    sortDirection, toggleSortDirection,
    currentPage, setCurrentPage,
    totalPages,
    isLoading,
    isError,
  } = useProductFilter();

  const toggleMobileFilter = () => setIsFilterOpen(!isFilterOpen);

  // Handling Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-500 font-medium mt-4">Đang tải danh sách thiết bị...</span>
      </div>
    );
  }

  // Handling Error State
  if (isError) {
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-red-50 text-red-600 p-8 rounded-3xl max-w-md mx-auto border border-red-100 shadow-sm">
          <h3 className="text-2xl font-bold mb-2">Mất kết nối với máy chủ</h3>
          <p className="text-red-500/80 mb-6">Vui lòng kiểm tra lại kết nối hoặc thử lại sau ít phút.</p>
          <button onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-colors">
            Thử lại ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="max-w-[1920px] mx-auto w-full flex flex-col lg:flex-row relative">
        {/* Mobile Filter Toggle */}
        <div
          className="lg:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b p-4 flex justify-between items-center mb-4">
          <span className="font-bold text-slate-800">Bộ lọc & Sắp xếp</span>
          <button
            onClick={toggleMobileFilter}
            className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm"
          >
            <Filter className="w-4 h-4" />
            <span>Lọc</span>
          </button>
        </div>

        {/* Desktop Sidebar / Mobile Drawer */}
        <div className={`
          ${isFilterOpen ? 'fixed inset-0 z-50' : 'hidden'}
          lg:relative lg:inset-auto lg:z-0 lg:block lg:w-72 shrink-0
        `}>
          {/* Mobile Backdrop */}
          <div className="absolute inset-0 bg-slate-900/50 lg:hidden backdrop-blur-sm"
               onClick={toggleMobileFilter}></div>

          <div
            className="absolute left-0 top-0 bottom-0 w-80 bg-white lg:bg-transparent lg:relative lg:w-full overflow-y-auto lg:overflow-visible shadow-2xl lg:shadow-none lg:p-0">
            <div className="flex lg:hidden justify-between items-center p-6 mb-6 border-b">
              <h2 className="text-xl font-bold">Bộ lọc thiết bị</h2>
              <button onClick={toggleMobileFilter} className="p-2 bg-slate-100 rounded-lg"><X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar>
              <ProductFilters
                selectedCategory={selectedCategory}
                onCategoryChange={(cat) => {
                  setSelectedCategory(cat);
                  setIsFilterOpen(false);
                }}
                selectedBrands={selectedBrands}
                onBrandChange={setSelectedBrands}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                resetFilters={resetFilters}
              />
            </Sidebar>
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-end mb-10">
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Danh mục thiết bị</h2>
              <p className="text-slate-500 font-medium">Khám phá kho thiết bị nhiếp ảnh chuyên nghiệp sẵn sàng cho
                thuê</p>
            </div>
            <div className="w-full md:w-auto">
              <ProductSort
                totalItems={filteredProducts.length}
                sortField={sortField}
                sortDirection={sortDirection}
                onSortFieldChange={setSortField}
                onSortDirectionToggle={toggleSortDirection}
              />
            </div>
          </div>

          {paginatedProducts.length > 0 ? (
            <div className="mb-12">
              <ProductGrid products={paginatedProducts} />
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 mb-12">
              <EmptyState
                title={NOT_FOUND_TITLE}
                description={NOT_FOUND_MESSAGE}
                icon="search"
                onAction={resetFilters}
                actionText="Xóa toàn bộ bộ lọc"
              />
            </div>
          )}

          <div className="flex justify-center border-t border-slate-100 pt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>
      <BackToTop />
    </Fragment>
  );
}

