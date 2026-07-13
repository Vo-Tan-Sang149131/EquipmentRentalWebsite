import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import type { Product } from '@/features/product/types/product.types.ts';

interface FeatureProductsProps {
  products: Product[];
  isLoading: boolean;
}


export function FeatureProducts({ products, isLoading }: FeatureProductsProps) {

  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Thiết bị mới nhất</h2>
              <p className="text-slate-500 text-sm md:text-base">Những thiết bị vừa được đăng tải gần đây</p>
            </div>
            <Link to="/products"
                  className="text-blue-600 font-semibold flex items-center hover:underline text-sm md:text-base">
              Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-4/5 bg-slate-200 animate-pulse rounded-2xl"></div>
                  <div className="h-4 bg-slate-200 animate-pulse rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 animate-pulse rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {products.map((product: any) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-4/5 overflow-hidden">
                    <img
                      src={product.primaryImageUrl || 'https://via.placeholder.com/400x500?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                        {product.categoryName}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3
                      className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-500 mb-4">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-slate-400 text-xs ml-1">(0)</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Giá từ</p>
                        <p className="text-lg font-extrabold text-blue-600">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(product.minPricePerDay)}
                          <span className="text-xs text-slate-400 font-normal">/ngày</span>
                        </p>
                      </div>
                      <div
                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>);
}
