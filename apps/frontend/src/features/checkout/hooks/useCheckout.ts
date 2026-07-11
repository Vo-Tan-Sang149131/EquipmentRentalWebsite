import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/order.service';
import type { CheckoutRequest } from '../types/order.types';

export function useCheckout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const checkoutMutation = useMutation({
    mutationFn: (payload: CheckoutRequest) => orderService.getCheckout(payload),

    onSuccess: (data, variables) => {
      // 1. Làm mới lại bộ nhớ đệm (Cache) giỏ hàng vì đống đồ đó đã chuyển sang hóa đơn
      queryClient.invalidateQueries({ queryKey: ['cart'] }).then(r => {
        console.log('refetch cart', r);
      });

      const { paymentUrl, orderId, totalPrice } = data;
      const method = variables.paymentMethod;

      // 2. PHÂN NHÁNH ĐIỀU HƯỚNG THÔNG MINH THEO PHƯƠNG THỨC THANH TOÁN
      if (method === 'VNPAY' || method === 'MOMO') {
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          alert('Không tìm thấy link thanh toán từ hệ thống!');
        }
      } else if (method === 'BANK_TRANSFER') {
        // Chuyển sang trang hiển thị ảnh QR VietQR động (Chúng ta sẽ thiết kế trang này sau)
        navigate(`/checkout/bank-transfer?orderId=${orderId}&amount=${totalPrice}&url=${encodeURIComponent(paymentUrl)}`);
      } else {
        navigate(`/checkout/success?orderId=${orderId}`);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      // Bắt các lỗi nghiệp vụ từ Backend ném ra (Ví dụ: 400 - Ai đó vừa đặt trùng lịch máy trong lúc bạn đang lưỡng lự)
      const errorMsg = error.response?.data?.message || 'Khởi tạo đơn hàng thất bại. Vui lòng thử lại!';
      alert(errorMsg);
    },
  });

  return {
    processCheckout: checkoutMutation.mutateAsync, // Hàm để Component UI kích hoạt
    isProcessing: checkoutMutation.isPending,      // Trạng thái đang chạy (Xoay xoay nút bấm UI)
    checkoutData: checkoutMutation.data,          // Dữ liệu trả về nếu cần dùng
  };
}
