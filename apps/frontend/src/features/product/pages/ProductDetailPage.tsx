import { useParams, useNavigate } from 'react-router-dom'; // 1. Import thêm useNavigate
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/product.service.ts';
import { ProductGallery } from '@/features/product/components/detail/ProductGallery.tsx';
import { ProductInfo } from '@/features/product/components/detail/ProductInfo.tsx';
import { ProductDetailTabs } from '@/features/product/components/detail/ProductDetailTabs.tsx';
import { RentalBookingCard } from '@/features/product/components/detail/RentalBookingCard.tsx';
import { RelatedProducts } from '@/features/product/components/detail/RelatedProducts.tsx';
import { chatService } from '@/features/chat/services/chat.service'; // 2. Import chatService
import { MessageSquare } from 'lucide-react'; // 3. Import icon chat
import { useState } from 'react';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);

  const { data: detailData, isLoading, isError } = useQuery({
    queryKey: ['deviceDetail', id],
    queryFn: () => productService.getDeviceDetail(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="text-center py-20">Đang tải thông tin...</div>;
  if (isError || !detailData) return <div className="text-center py-20 text-red-500">Lỗi tải dữ liệu hoặc thiết bị không
    tồn tại.</div>;

  // Hàm xử lý kích hoạt phòng chat
  const handleChatStart = async () => {
    setIsConnecting(true);
    try {
      const roomData = await chatService.getOrCreateRoom({
        ownerId: detailData.owner.id, // ID của chủ máy từ API detailData
        productId: detailData.product.id, // ID của sản phẩm
      });
      // Chuyển hướng qua trang tin nhắn kèm room id trên url
      navigate(`/messages?room=${roomData.id}`);
    } catch (error) {
      console.error('Không thể kết nối với chủ máy:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 min-w-0 space-y-8">
          <ProductGallery images={detailData.device.images} />

          <div className="space-y-4">
            <ProductInfo
              product={detailData.product}
              owner={detailData.owner}
              conditionPercent={detailData.device.conditionPercent}
            />

            <button
              onClick={handleChatStart}
              disabled={isConnecting}
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-blue-50 text-blue-600 border border-blue-200 px-5 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              {isConnecting ? 'Đang kết nối chủ máy...' : `Nhắn tin với ${detailData.owner.fullName || 'Chủ máy'}`}
            </button>
          </div>

          <div className="hidden lg:block">
            <ProductDetailTabs
              specifications={detailData.product.specifications}
              includedItems={detailData.product.includedItems}
              reviews={detailData.reviews || []}
            />
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <RentalBookingCard
              pricePerDay={detailData.device.pricePerDay}
              depositValue={detailData.device.depositValue}
              insurance={detailData.device.insurance}
              availability={detailData.device.availability}
              bookDates={detailData.device.bookDates}
              deviceId={detailData.device.id}
            />
          </div>
        </div>

        <div className="lg:hidden mt-8">
          <ProductDetailTabs
            specifications={detailData.product.specifications}
            includedItems={detailData.product.includedItems}
            reviews={detailData.reviews || []}
          />
        </div>
      </div>
      <div className="mt-12">
        <RelatedProducts
          products={detailData.relatedProducts || []}
          categoryName={detailData.product.categoryName}
        />
      </div>
    </div>
  );
}
