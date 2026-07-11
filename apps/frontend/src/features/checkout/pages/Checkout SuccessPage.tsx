import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, CalendarRange } from 'lucide-react';

export function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Lấy mã đơn hàng động từ URL lên để hiển thị thông báo cho khách
  const orderId = searchParams.get('orderId') || '';

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-xl mx-auto px-6 text-center space-y-6">
      {/* Icon check xanh lá bắt mắt */}
      <div className="bg-emerald-50 p-4 rounded-full border border-emerald-100 animate-bounce">
        <CheckCircle2 className="w-16 h-16 text-emerald-500" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-800">Đặt lịch thuê thành công!</h1>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Yêu cầu đặt thuê thiết bị của bạn đã được hệ thống ghi nhận. Chủ máy sẽ liên hệ xác nhận bàn giao sớm nhất.
        </p>
      </div>

      {/* Box thông tin đơn hàng */}
      {orderId && (
        <div className="bg-slate-50 border rounded-2xl p-4 w-full grid grid-cols-2 gap-4 text-sm divide-x text-left">
          <div className="pl-2">
            <span className="text-gray-400 block text-xs">Mã đơn hàng:</span>
            <span className="font-mono font-bold text-slate-800 text-base">#DH{orderId}</span>
          </div>
          <div className="pl-6">
            <span className="text-gray-400 block text-xs">Trạng thái đơn:</span>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
              Chờ xác nhận
            </span>
          </div>
        </div>
      )}

      {/* Hệ thống nút hành động điều hướng nhanh */}
      <div className="flex flex-col w-full space-y-3 pt-2">
        <button
          onClick={() => navigate('/profile')} // Điều hướng sang trang Lịch sử thuê (Cụm 3)
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition flex items-center justify-center space-x-2 shadow-sm"
        >
          <CalendarRange className="w-4 h-4" />
          <span>Xem lịch sử đơn thuê</span>
        </button>

        <button
          onClick={() => navigate('/products')} // Quay lại catalog xem tiếp
          className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 py-3.5 rounded-xl font-semibold transition flex items-center justify-center space-x-2"
        >
          <ShoppingBag className="w-4 h-4 text-gray-400" />
          <span>Tiếp tục tìm đồ nhiếp ảnh</span>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
