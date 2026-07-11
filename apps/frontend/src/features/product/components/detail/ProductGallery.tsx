// @/features/product/components/detail/ProductGallery.tsx
import { useState } from 'react';
import type { ProductImage } from '@/features/product/types/product.types.ts';

interface ProductGalleryProps {
  images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const initialImage = images.find((img) => img.isPrimary) || images[0];
  const [mainImage, setMainImage] = useState<ProductImage | null>(initialImage);

  const thumbnails = images.slice(0, 5);

  return (
    <div className="rounded-2xl border bg-white p-2 md:p-4 space-y-3 md:space-y-4 shadow-sm">
      {/* Main image */}
      <div className="aspect-square md:aspect-4/3 w-full overflow-hidden rounded-xl bg-gray-100">
        {mainImage ? (
          <img
            src={mainImage.imageUrl}
            alt="Product Main"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-3">
        {thumbnails.map((image) => (
          <div
            key={image.id}
            onClick={() => setMainImage(image)}
            className={`aspect-square overflow-hidden rounded-lg border bg-gray-50 cursor-pointer hover:opacity-80 transition ${
              mainImage?.id === image.id
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-gray-200'
            }`}
          >
            <img
              src={image.imageUrl}
              alt="Thumbnail"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
