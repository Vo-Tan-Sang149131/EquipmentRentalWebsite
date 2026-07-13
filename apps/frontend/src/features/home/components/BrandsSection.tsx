import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { LookupItem } from '@/features/product/types/product.types.ts';

interface BrandsCarouselProps {
  brands: LookupItem[];
  isLoading: boolean;
}

export function BrandsCarousel({ brands, isLoading }: BrandsCarouselProps) {
  const [offset, setOffset] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const itemRef = useRef<HTMLDivElement>(null);

  // Nhân đôi danh sách để tạo loop vô hạn
  const loopBrands = [...brands, ...brands];

  // Đo width item khi render lần đầu
  useEffect(() => {
    if (itemRef.current) {
      const gap = 24; // khoảng cách giữa các item (gap-6 ~ 1.5rem = 24px)
      setItemWidth(itemRef.current.offsetWidth + gap);
    }
  }, [brands]);

  // Auto chạy
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => {
        if (itemWidth && prev <= -brands.length * itemWidth) {
          return 0; // reset khi chạy hết một vòng
        }
        return prev - 2; // dịch sang trái 2px mỗi tick
      });
    }, 30);
    return () => clearInterval(interval);
  }, [brands, itemWidth]);

  const handlePrev = () => {
    setOffset((prev) => prev + itemWidth);
  };

  const handleNext = () => {
    setOffset((prev) => prev - itemWidth);
  };

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Thương hiệu nổi bật</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full border hover:bg-gray-100 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full border hover:bg-gray-100 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 w-32 bg-slate-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : (
        <motion.div
          className="flex gap-6"
          animate={{ x: offset }}
          transition={{ type: 'tween', ease: 'linear', duration: 0.3 }}
        >
          {loopBrands.map((brand, i) => (
            <div
              key={`${brand.id}-${i}`}
              ref={i === 0 ? itemRef : null} // đo width item đầu tiên
              className="shrink-0 w-32 sm:w-40 md:w-48 bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all text-center cursor-pointer"
            >
              <Link to={`/products?brands=${brand.name}`}>
                <span className="font-bold text-sm md:text-base text-slate-700 hover:text-blue-600 transition-colors">
                  {brand.name}
                </span>
              </Link>
            </div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
