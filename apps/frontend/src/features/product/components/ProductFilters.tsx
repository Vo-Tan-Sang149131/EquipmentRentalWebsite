// @/features/product/components/ProductFilters.tsx
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { DEFAULT_PRICE_RANGE } from '@/features/product/constants/defaultValues.ts';
import { useEffect, useState } from 'react';
import { BrandFilters } from '@/features/product/components/BrandFilters.tsx';

interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  resetFilters: () => void;
}

export function ProductFilters({
                                 selectedCategory,
                                 onCategoryChange,
                                 selectedBrands,
                                 onBrandChange,
                                 priceRange,
                                 onPriceRangeChange,
                                 resetFilters,
                               }: ProductFiltersProps) {

  const { data: categoriesData = [], isLoading: isLoadingCats } = useQuery({
    queryKey: ['lookup-categories'],
    queryFn: productService.getCategories,
  });

  const { data: brandsData = [], isLoading: isLoadingBrands } = useQuery({
    queryKey: ['lookup-brands', selectedCategory], // Add value for react query cache key
    queryFn: () => productService.getBrands(selectedCategory),
  });


  const { data: serverPriceRange, isLoading: isLoadingPrice } = useQuery({
    queryKey: ['lookup-price-range', selectedCategory], // Add value for react query cache key
    queryFn: () => productService.getPriceRange(selectedCategory),
  });

  const dynamicCategories = ['All', ...categoriesData.map(c => c.name)];

  const absoluteMin = serverPriceRange?.minPrice ?? DEFAULT_PRICE_RANGE[0];
  const absoluteMax = serverPriceRange?.maxPrice ?? DEFAULT_PRICE_RANGE[1];

  const [localRange, setLocalRange] = useState<[number, number]>([absoluteMin, absoluteMax]);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlMin = urlParams.get('minPrice');
    const urlMax = urlParams.get('maxPrice');

    if (urlMin && urlMax) {
      setLocalRange([Number(urlMin), Number(urlMax)]);
    } else {
      setLocalRange([absoluteMin, absoluteMax]);
    }
  }, [priceRange, serverPriceRange, absoluteMin, absoluteMax]);
  

  if (isLoadingCats || isLoadingBrands || isLoadingPrice) {
    return <div className="text-gray-400 text-sm p-4">Đang tải bộ lọc...</div>;
  }

  return (
    <>
      <div className="flex justify-between">
        <h2 className="font-bold text-lg">Filters</h2>
        <button className="text-sm text-blue-600 font-medium hover:underline cursor-pointer" onClick={resetFilters}>
          Xóa bộ lọc
        </button>
      </div>

      <div className="mt-4 pb-2 mb-4 text-left">
        <h2 className="font-semibold text-sm text-gray-700">Category</h2>
        <div className="flex flex-col gap-2 mt-2 text-left">
          {dynamicCategories.map((category) => (
            <div
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`rounded-lg px-2 py-1 border cursor-pointer hover:bg-gray-50 border-gray-200 transition text-sm
                ${selectedCategory === category ? 'bg-blue-50 border-blue-400 text-blue-700 font-medium' : ''}`}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-col gap-2 mt-2 text-left">
          <h2 className="font-semibold text-sm text-gray-700">Price Range</h2>

          {/* And condtion render slider if localRange is valid */}
          {Array.isArray(localRange) && localRange.length === 2 && localRange[0] <= localRange[1] ? (
            <Slider
              key={`${absoluteMin}-${absoluteMax}-${selectedCategory}`}
              range
              min={absoluteMin}
              max={absoluteMax}
              step={50000}
              value={localRange}
              onChange={(value) => setLocalRange(value as [number, number])}
              onChangeComplete={(value) => onPriceRangeChange(value as [number, number])}
            />
          ) : (
            <div className="h-2 bg-gray-200 rounded animate-pulse my-2" />
          )}

          <p className="text-xs text-gray-500">
            Selected range: {localRange[0].toLocaleString('vi-VN')}đ - {localRange[1].toLocaleString('vi-VN')}đ
          </p>
        </div>
      </div>


      <BrandFilters
        brands={brandsData}
        selectedBrands={selectedBrands}
        onBrandChange={onBrandChange}
      />

    </>
  );
}
