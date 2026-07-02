import { useEffect, useState, useCallback } from 'react';
import { deviceService } from '../services/deviceService';
import type { Review } from '../types/device.types';
import type { SpringPageResponse } from '@/features/product/types/product.types.ts';
import ProductPagination from '@/features/product/components/Pagination.tsx';
import { Star, MessageSquare, Calendar, Quote } from 'lucide-react';

export default function OwnerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPage = useCallback((p: number) => {
    setLoading(true);
    deviceService.getOwnerReviews(p - 1, 10)
      .then((res: SpringPageResponse<Review>) => {
        setReviews(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Đánh giá từ khách hàng</h1>
        <p className="text-gray-500 mt-1">Xem những phản hồi và góp ý từ những người đã thuê thiết bị của bạn.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Chưa có đánh giá nào</h3>
          <p className="text-gray-500 mt-1">Những đánh giá đầu tiên sẽ giúp bạn xây dựng uy tín trên nền tảng.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(rev => (
            <div key={rev.id}
                 className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Quote className="w-12 h-12" />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {rev.renterUsername.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 leading-none">{rev.renterUsername}</h4>
                  <div className="flex items-center gap-1 mt-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-gray-50/50 p-4 rounded-xl mb-4 border border-gray-100">
                <p className="text-gray-700 text-sm italic leading-relaxed">"{rev.comment}"</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-blue-500">Đã xác thực thuê máy</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && reviews.length > 0 && (
        <ProductPagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}
