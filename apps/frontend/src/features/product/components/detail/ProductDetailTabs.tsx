// @/features/product/components/detail/ProductDetailTabs.tsx
import type { Review, Specification } from '@/features/product/types/product.types.ts';
import { ProductSpecification } from '@/features/product/components/detail/ProductSpecification.tsx';

interface ProductDetailTabsProps {
  specifications: Specification[];
  includedItems: string[];
  reviews: Review[];
}

export function ProductDetailTabs({ specifications, includedItems, reviews }: ProductDetailTabsProps) {
  return (
    <div className="rounded-xl border bg-white p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Thông số kỹ thuật</h2>
        <table className="w-full text-sm">
          <tbody>
          {specifications.map((spec, index) => (
            <ProductSpecification
              key={spec.label}
              label={spec.label}
              value={spec.value}
              isLast={index === specifications.length - 1}
            />
          ))}
          </tbody>
        </table>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Vật phẩm đi kèm</h2>

        <ul className="list-disc pl-5 text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
          {includedItems.map((item, index) => (
            <li className="text-left" key={index}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Đánh giá thực tế</h2>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-left">Chưa có đánh giá nào cho thiết bị này.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm text-gray-800">{review.username}</span>
                  <span className="text-yellow-500 text-sm">★ {review.rating}/5</span>
                </div>
                <p className="text-sm text-gray-600 text-left">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
