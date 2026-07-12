// @/features/product/components/ProductFilters.tsx
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { DEFAULT_PRICE_RANGE } from '@/features/product/constants/defaultValues.ts';
import { useEffect, useState } from 'react';

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
    queryKey: ['lookup-brands'],
    queryFn: productService.getBrands,
  });

  const { data: serverPriceRange } = useQuery({
    queryKey: ['lookup-price-range'],
    queryFn: () => productService.getPriceRange(selectedCategory),
  });

  const dynamicCategories = ['All', ...categoriesData.map(c => c.name)];
  const dynamicBrands = brandsData.map(b => b.name);

  const absoluteMin = serverPriceRange?.minPrice ?? DEFAULT_PRICE_RANGE[0];
  const absoluteMax = serverPriceRange?.maxPrice ?? DEFAULT_PRICE_RANGE[1];

  const [localRange, setLocalRange] = useState<[number, number]>(() => {
    return [
      Number(new URLSearchParams(window.location.search).get('minPrice')) || absoluteMin,
      Number(new URLSearchParams(window.location.search).get('maxPrice')) || absoluteMax,
    ];
  });


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlMin = urlParams.get('minPrice');
    const urlMax = urlParams.get('maxPrice');

    if (urlMin && urlMax) {
      // Nếu trên URL đang có khoảng giá, hiển thị theo URL
      setLocalRange([Number(urlMin), Number(urlMax)]);
    } else {
      // Nếu URL trống (như từ trang chủ sang hoặc bấm Xóa bộ lọc), lấy thẳng min/max của danh mục đó từ Server
      setLocalRange([absoluteMin, absoluteMax]);
    }
  }, [priceRange, serverPriceRange, absoluteMin, absoluteMax]);
  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandChange([...selectedBrands, brand]);
    }
  };

  if (isLoadingCats || isLoadingBrands) {
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

          {Array.isArray(localRange) && localRange.length === 2 ? (
            <Slider
              key={`${absoluteMin}-${absoluteMax}-${selectedCategory}`} // Ép re-mount khi đổi danh mục
              range
              min={absoluteMin}
              max={absoluteMax}
              step={50000}
              value={localRange} // Chạy mượt theo State cục bộ
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


      <div className="mt-4 pb-2 mb-4 text-left">
        <h2 className="font-semibold text-sm text-gray-700 mb-2">Brand</h2>
        <ul className="space-y-2">
          {dynamicBrands.map((brand) => (
            <li key={brand} className="flex items-center text-sm">
              <input
                type="checkbox"
                id={brand}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
              />
              <label htmlFor={brand} className="ml-2 text-gray-600 cursor-pointer select-none">
                {brand}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
