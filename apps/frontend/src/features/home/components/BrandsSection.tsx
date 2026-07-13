import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import type { LookupItem } from '@/features/product/types/product.types.ts';

interface BrandsSectionProps {
  brands: LookupItem[];
  isLoading: boolean;
}

export function BrandsSection({ brands, isLoading }: BrandsSectionProps) {

  return (
    <>
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Thương hiệu nổi bật</h2>
            <p className="text-slate-500 text-sm md:text-base">Khám phá các thương hiệu được yêu thích nhất</p>
          </div>
          <Link
            to="/products"
            className="text-blue-600 font-semibold flex items-center hover:underline text-sm md:text-base"
          >
            Tất cả <span className="hidden sm:inline ml-1">thương hiệu</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {brands.map((brand: any, i: number) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/products?brands=${brand.name}`}
                  className="group bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all text-center cursor-pointer"
                >
                  {/* Nếu có logo thì hiển thị */}
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="w-12 h-12 object-contain mx-auto mb-3 md:mb-4"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Tag className="h-6 w-6" />
                    </div>
                  )}
                  <span
                    className="font-bold text-sm md:text-base text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-1">
              {brand.name}
            </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
