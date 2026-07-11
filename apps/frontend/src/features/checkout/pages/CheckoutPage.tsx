import { useState } from 'react';
import { useCart } from '@/features/cart/hooks/useCart';
import { useCheckout } from '../hooks/useCheckout';
import { CreditCard, Wallet, Banknote, Landmark, ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PaymentMethod } from '@/features/checkout/types/order.types.ts';

export function CheckoutPage() {
  const { cart, isLoading: isCartLoading } = useCart();
  const { processCheckout, isProcessing } = useCheckout();

  // 1. Quản lý trạng thái phương thức thanh toán khách lựa chọn (Mặc định chọn VNPAY)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('VNPAY');

  // 2. Trạng thái đang tải thông tin giỏ hàng
  if (isCartLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500">Đang đồng bộ hóa hóa đơn tạm tính...</p>
      </div>
    );
  }

  // 3. Trạng thái giỏ hàng trống (Không có đồ thì không cho checkout)
  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20 max-w-md mx-auto space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">Không có thiết bị nào cần thanh toán</h3>
        <Link to="/cart"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
          <ArrowLeft className="w-4 h-4" /> <span>Quay lại giỏ hàng</span>
        </Link>
      </div>
    );
  }

  // 4. Hàm kích hoạt lệnh Đặt hàng và Thanh toán
  const handlePaymentSubmit = async () => {
    try {
      const payload = {
        cartItemIds: cart.items.map((item) => item.cartItemId),
        paymentMethod: paymentMethod,
      };

      // Gọi hàm qua custom hook useCheckout (Xử lý chuyển hướng tự động nằm trong hook)
      await processCheckout(payload);
    } catch {
      // Lỗi đã được hook useCheckout bắt và alert, block này giữ để tránh unhandled promise rejections
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex items-center space-x-2 mb-6">
        <Link to="/cart"
              className="text-gray-500 hover:text-blue-600 transition flex items-center space-x-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> <span>Quay lại sửa giỏ hàng</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Xác nhận thanh toán</h1>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI: PHƯƠNG THỨC THANH TOÁN & ĐƠN THUÊ TÓM TẮT */}
        <div className="w-full lg:col-span-8 space-y-8 text-left">

          {/* Nhóm 1: Chọn phương thức thanh toán */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-800">1. Chọn phương thức thanh toán</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* VNPAY CARD */}
              <label onClick={() => setPaymentMethod('VNPAY')}
                     className={`border rounded-xl p-4 flex items-center space-x-4 cursor-pointer transition ${paymentMethod === 'VNPAY' ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600' : 'hover:border-gray-300'}`}>
                <div
                  className={`p-2.5 rounded-lg ${paymentMethod === 'VNPAY' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-slate-800">Cổng cổng VNPay</div>
                  <div className="text-xs text-gray-400 mt-0.5">Thẻ ATM / Quốc tế / Quét QR</div>
                </div>
              </label>

              {/* MOMO CARD */}
              <label onClick={() => setPaymentMethod('MOMO')}
                     className={`border rounded-xl p-4 flex items-center space-x-4 cursor-pointer transition ${paymentMethod === 'MOMO' ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600' : 'hover:border-gray-300'}`}>
                <div
                  className={`p-2.5 rounded-lg ${paymentMethod === 'MOMO' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-slate-800">Ví điện tử MoMo</div>
                  <div className="text-xs text-gray-400 mt-0.5">Ứng dụng MoMo Sandbox</div>
                </div>
              </label>

              {/* BANK TRANSFER CARD */}
              <label onClick={() => setPaymentMethod('BANK_TRANSFER')}
                     className={`border rounded-xl p-4 flex items-center space-x-4 cursor-pointer transition ${paymentMethod === 'BANK_TRANSFER' ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600' : 'hover:border-gray-300'}`}>
                <div
                  className={`p-2.5 rounded-lg ${paymentMethod === 'BANK_TRANSFER' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-slate-800">Chuyển khoản VietQR</div>
                  <div className="text-xs text-gray-400 mt-0.5">Tự động điền tiền & nội dung</div>
                </div>
              </label>

              {/* CASH CARD */}
              <label onClick={() => setPaymentMethod('CASH')}
                     className={`border rounded-xl p-4 flex items-center space-x-4 cursor-pointer transition ${paymentMethod === 'CASH' ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600' : 'hover:border-gray-300'}`}>
                <div
                  className={`p-2.5 rounded-lg ${paymentMethod === 'CASH' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-slate-800">Tiền mặt khi nhận máy</div>
                  <div className="text-xs text-gray-400 mt-0.5">Thanh toán trực tiếp cho Owner</div>
                </div>
              </label>

            </div>
          </div>

          {/* Nhóm 2: Xem lại danh sách chốt lần cuối */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-800">2. Danh sách thiết bị thuê</h2>
            <div className="divide-y">
              {cart.items.map((item) => (
                <div key={item.cartItemId} className="flex py-4 first:pt-0 last:pb-0 items-center justify-between">
                  <div className="flex items-center overflow-hidden">
                    <img src={item.device.primaryImageUrl} alt={item.device.name}
                         className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border bg-gray-50 shrink-0" />
                    <div className="ml-3 overflow-hidden">
                      <h4 className="font-medium text-sm text-slate-800 line-clamp-1">{item.device.name}</h4>
                      <div className="flex items-center space-x-1 text-xs text-gray-400 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span
                          className="truncate">{new Date(item.startDate).toLocaleDateString('vi-VN')} - {new Date(item.endDate).toLocaleDateString('vi-VN')}</span>
                        <span className="text-teal-600 font-semibold ml-1 shrink-0">({item.rentalDays} n)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-semibold text-slate-700 text-sm shrink-0 ml-4">
                    {item.subTotalRentalFee.toLocaleString('vi-VN')} ₫
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CỘT PHẢI: HOÁ ĐƠN CHỐT & NÚT HÀNH ĐỘNG THẦN THÁNH */}
        <div className="w-full lg:col-span-4 bg-gray-50 border rounded-2xl p-6 space-y-6 lg:sticky lg:top-28 text-left">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3">Chi tiết hóa đơn</h2>

          <div className="space-y-4 text-sm border-b pb-4">
            <div className="flex justify-between text-gray-600">
              <span>Tổng chi phí thuê máy:</span>
              <span className="font-semibold text-slate-800">{cart.totalRentalFeeAll.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tổng tiền cọc máy:</span>
              <span className="font-semibold text-slate-800">{cart.totalDepositAll.toLocaleString('vi-VN')} ₫</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-gray-900 text-xl pt-1">
            <span>Tổng thanh toán:</span>
            <span className="text-teal-600">{cart.grandTotal.toLocaleString('vi-VN')} ₫</span>
          </div>

          <button
            onClick={handlePaymentSubmit}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-white transition shadow-sm ${isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isProcessing ? 'Đang khởi tạo phiên...' : 'Xác nhận & Thanh toán ngay'}
          </button>
        </div>
      </div>
    </div>
  );
}
