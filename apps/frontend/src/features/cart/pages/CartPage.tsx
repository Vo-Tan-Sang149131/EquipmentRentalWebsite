import { useCart } from '../hooks/useCart';
import { Trash2, ArrowLeft, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function CartPage() {
  const navigate = useNavigate();
  const { cart, isLoading, isError, removeFromCart } = useCart();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500">Thùng xe đẩy đang được tải...</p>
      </div>
    );
  }

  if (isError || !cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20 max-w-md mx-auto space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">Giỏ hàng của bạn đang trống</h3>
        <p className="text-gray-500 text-sm">Hãy quay lại danh mục sản phẩm và lựa chọn những thiết bị nhiếp ảnh ưng ý
          nhất cho hành trình của mình.</p>
        <Link to="/products"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
          <ArrowLeft className="w-4 h-4" /> <span>Tiếp tục khám phá</span>
        </Link>
      </div>
    );
  }

  const handleDeleteItem = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa thiết bị này khỏi giỏ hàng?')) {
      try {
        await removeFromCart(id);

        toast.success('Đã xóa item khỏi giỏ hàng thanh công');

      } catch {
        toast.error('Không thể xóa món đồ, vui lòng thử lại!');
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
        <div className="w-full lg:col-span-8 space-y-4">
          {cart.items.map((item) => (
            <div key={item.cartItemId}
                 className="flex flex-col sm:flex-row bg-white border rounded-2xl p-4 shadow-sm group hover:border-gray-300 transition">
              {/* Ảnh thiết bị */}
              <img
                src={item.device.primaryImageUrl}
                alt={item.device.name}
                className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-xl bg-gray-50 border shrink-0 mb-4 sm:mb-0"
              />

              <div className="sm:ml-4 flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                      Chủ máy: {item.device.ownerName}
                    </span>
                    <button
                      onClick={() => handleDeleteItem(item.cartItemId)}
                      className="sm:hidden text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-lg text-slate-800 mt-1 line-clamp-1">
                    {item.device.name}
                  </h3>

                  <div className="flex items-center space-x-1.5 text-xs text-gray-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {new Date(item.startDate).toLocaleDateString('vi-VN')} - {new Date(item.endDate).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="text-teal-600 font-medium ml-1">({item.rentalDays} ngày)</span>
                  </div>
                </div>

                <div className="text-sm font-medium text-gray-400 mt-2">
                  Giá: <span
                  className="text-slate-700 font-semibold">{item.device.pricePerDay.toLocaleString('vi-VN')} đ</span> /ngày
                </div>
              </div>

              <div
                className="sm:ml-6 flex flex-row sm:flex-col justify-between items-center sm:items-end shrink-0 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0">
                <button
                  onClick={() => handleDeleteItem(item.cartItemId)}
                  className="hidden sm:block text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="text-xs text-gray-400">Tiền thuê tạm tính:</div>
                  <div className="font-bold text-teal-600 text-lg">
                    {item.subTotalRentalFee.toLocaleString('vi-VN')} ₫
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:col-span-4 bg-gray-50 border rounded-2xl p-6 space-y-6 lg:sticky lg:top-28">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 text-left">Tóm tắt đơn thuê</h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tổng tiền thuê máy:</span>
              <span className="font-medium text-gray-900">{cart.totalRentalFeeAll.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tổng tiền cọc thiết bị:</span>
              <span className="font-medium text-gray-900">{cart.totalDepositAll.toLocaleString('vi-VN')} ₫</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed text-left">* Tiền đặt cọc riêng của máy sẽ được chủ
              máy hoàn
              trả lại 100% cho bạn ngay sau khi hoàn thành bàn giao thiết bị sạch sẽ.</p>

            <div className="border-t pt-4 flex justify-between font-bold text-gray-900 text-lg">
              <span>Tổng chi phí:</span>
              <span className="text-teal-600">{cart.grandTotal.toLocaleString('vi-VN')} ₫</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition shadow-sm"
            >
              Tiến hành thanh toán
            </button>

            <button
              onClick={() => navigate('/products')}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 rounded-xl font-medium transition text-center text-sm"
            >
              Thuê thêm thiết bị khác
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
