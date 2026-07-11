// @/features/product/components/detail/ProductInfo.tsx
import type { ProductInformation, Owner } from '@/features/product/types/product.types.ts';

interface ProductInfoProps {
  product: ProductInformation;
  owner: Owner;
  conditionPercent: number;
}

export function ProductInfo({ product, owner, conditionPercent }: ProductInfoProps) {
  return (
    <div className="rounded-xl border bg-white p-6 space-y-4">
      {/* Thương hiệu & Danh mục */}
      <div className="flex gap-2 text-sm text-gray-500">
        <span className="font-medium text-gray-700">{product.brandName}</span>
        <span>•</span>
        <span>{product.categoryName}</span>
      </div>

      {/* Tên sản phẩm */}
      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

      {/* Độ mới thiết bị */}
      <div>
        <span
          className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-650/20">
          Độ mới: {conditionPercent}%
        </span>
      </div>

      {/* Thông tin chủ sở hữu (Owner) */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        {owner.avatarUrl ? (
          <img src={owner.avatarUrl} alt={owner.fullName} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200" />
        )}
        <div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-800">{owner.fullName}</span>
            {owner.verified && (
              <span className="text-blue-500 text-xs" title="Đã xác minh chính chủ">✓</span>
            )}
          </div>
          <p className="text-xs text-gray-500">Chủ sở hữu thiết bị</p>
        </div>
      </div>
    </div>
  );
}
