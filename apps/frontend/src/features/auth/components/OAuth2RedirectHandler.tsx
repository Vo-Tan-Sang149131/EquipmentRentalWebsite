import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useCart } from '@/features/cart/hooks/useCart.ts';
import { toast } from 'sonner';

export function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);
  const { addToCart } = useCart();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const rolesString = searchParams.get('roles');

    if (token && username && rolesString) {
      const roles = rolesString.split(',');

      loginSuccess({ username, roles }, token);

      const savedRedirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/home';
      const pendingBookingStr = sessionStorage.getItem('pendingBooking');

      sessionStorage.removeItem('redirectAfterLogin');
      sessionStorage.removeItem('pendingBooking');

      const handleRedirect = async () => {
        if (pendingBookingStr) {
          try {
            const pendingBooking = JSON.parse(pendingBookingStr);
            await addToCart(pendingBooking);
            toast.success(`Chào mừng ${username}! Đã thêm thiết bị vào giỏ hàng.`);
            navigate('/cart', { replace: true });
            return;
          } catch (error) {
            console.error('Lỗi tự động thêm vào giỏ hàng sau OAuth:', error);
            navigate('/cart', { replace: true });
            return;
          }
        }

        toast.success(`Chào mừng quay trở lại, ${username}!`);
        navigate(savedRedirectUrl, { replace: true });
      };

      handleRedirect().then(r => {
        console.log(r);
      });

    } else {
      toast.error('Đăng nhập mạng xã hội thất bại. Vui lòng thử lại!');
      navigate('/login?error=oauth2_failed');
    }
  }, [searchParams, loginSuccess, navigate, addToCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Đang xác thực tài khoản của bạn, vui lòng đợi...</p>
      </div>
    </div>
  );
}
