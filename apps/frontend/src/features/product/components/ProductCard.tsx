import { Link } from 'react-router-dom'; // 1. NHỚ IMPORT LINK
import { type Product } from '@/features/product/types/product.types.ts';

interface ProductProps {
  product: Product;
}

export default function ProductCard({ product }: ProductProps) {
  const isAvailable = product.status === 'AVAILABLE';

  const cardClasses = `bg-white border rounded-xl overflow-hidden flex flex-col group transition ${
    isAvailable ? 'hover:shadow-lg cursor-pointer' : 'opacity-75 cursor-not-allowed'
  }`;

  const renderContent = () => (
    <>
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        <img
          src={product.primaryImageUrl || 'https://placehold.co'}
          alt={product.name}
          className={`w-full h-full object-cover transition duration-300 ${isAvailable ? 'group-hover:scale-105' : ''}`}
        />
        <span className={`absolute top-3 left-3 text-white px-2 py-1 text-xs rounded font-medium ${
          isAvailable ? 'bg-green-500' : 'bg-gray-500'
        }`}>
          {isAvailable ? 'Còn máy' : 'Hết máy'}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 space-y-2 text-left">
        <span className="text-blue-600 uppercase text-xs font-semibold tracking-wider">
          {product.brandName || 'Đang cập nhật'}
        </span>

        <h3 className="font-semibold text-base text-slate-800 line-clamp-2 min-h-12">
          {product.name}
        </h3>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium">Giá thuê từ:</span>
            <span className="font-bold text-teal-600 text-lg">
              {product.minPricePerDay ? `${product.minPricePerDay.toLocaleString('vi-VN')} ₫` : '0 ₫'}
              <span className="text-xs text-gray-400 font-normal">/ngày</span>
            </span>
          </div>

          <span
            className={`px-4 py-2 rounded-lg text-sm font-medium transition shrink-0 text-white ${
              isAvailable
                ? 'bg-blue-600 group-hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isAvailable ? 'Xem chi tiết' : 'Tạm hết máy'}
          </span>
        </div>
      </div>
    </>
  );

  if (!isAvailable) {
    return <div className={cardClasses}>{renderContent()}</div>;
  }

  return (
    <Link to={`/products/${product.id}`} className={cardClasses}>
      {renderContent()}
    </Link>
  );
}
