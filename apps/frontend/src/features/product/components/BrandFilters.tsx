import type { LookupItem } from '@/features/product/types/product.types.ts';
import { useState } from 'react';
import { Filter } from 'lucide-react';

interface BrandFiltersProps {
  brands: LookupItem[];
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
}

export function BrandFilters({ brands, selectedBrands, onBrandChange }: BrandFiltersProps) {
  const [showBrands, setShowBrands] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const visibleBrands = showAll ? brands : brands.slice(0, 12);

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandChange([...selectedBrands, brand]);
    }
  };

  return (
    <div className="mt-4 pb-2 mb-4 text-left">
      {/* Header với icon filter */}
      <button
        onClick={() => setShowBrands(!showBrands)}
        className="flex items-center text-sm font-semibold text-gray-700 hover:text-blue-600 transition cursor-pointer"
      >
        <Filter className="h-4 w-4 mr-2" />
        Thương hiệu
      </button>

      {/* Block brand filter toggle */}
      {showBrands && (
        <div className="mt-3 flex flex-wrap gap-2">
          {visibleBrands.map((b) => (
            <div
              key={b.id}
              onClick={() => toggleBrand(b.name)}
              className={`px-3 py-1 rounded-full border cursor-pointer text-sm transition
                ${selectedBrands.includes(b.name)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}
              `}
            >
              {b.name}
            </div>
          ))}

          {brands.length > visibleBrands.length && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 text-sm mt-2 hover:underline"
            >
              {showAll ? 'Thu gọn' : 'Xem thêm...'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
