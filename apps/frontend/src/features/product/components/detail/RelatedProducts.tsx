import ProductCard from '@/features/product/components/ProductCard'; // Import component Card của bạn
import type { Product } from '@/features/product/types/product.types.ts';

interface RelatedProductProps {
  products: Product[];
  categoryName: string | null;
}

export function RelatedProducts({ products, categoryName }: RelatedProductProps) {
  return (
    <div className="space-y-6 text-left">
      <h2 className="text-2xl font-bold text-gray-900">
        Thiết bị {categoryName ? `thuộc danh mục ${categoryName}` : ''} liên quan
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((item) => (
          <div
            key={item.id}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ProductCard product={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
