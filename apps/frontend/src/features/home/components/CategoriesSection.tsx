import { Link } from 'react-router-dom';
import { ArrowRight, Camera } from 'lucide-react';
import type { LookupItem } from '@/features/product/types/product.types.ts';

interface CategoriesSectionProps {
  categories: LookupItem[];
  isLoading: boolean;
}

export function CategoriesSection({ categories, isLoading }: CategoriesSectionProps) {

  return (<>
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Danh mục nổi bật</h2>
          <p className="text-slate-500 text-sm md:text-base">Tìm kiếm theo loại thiết bị bạn cần</p>
        </div>
        <Link to="/products"
              className="text-blue-600 font-semibold flex items-center hover:underline text-sm md:text-base">
          Tất cả <span className="hidden sm:inline ml-1">danh mục</span> <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.name}`}
              className="group bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all text-center"
            >
              <div
                className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Camera className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <span
                className="font-bold text-sm md:text-base text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-1">{cat.name}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  </>);
}
