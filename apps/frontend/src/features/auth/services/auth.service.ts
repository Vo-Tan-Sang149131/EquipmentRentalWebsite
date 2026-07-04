// auth.service.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '@/features/auth/types/auth.types.ts';

import { useQuery } from '@tanstack/react-query';

import { useCart } from '@/features/cart/hooks/useCart.ts';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);
  const { addToCart } = useCart(); // Thêm hook giỏ hàng vào đây

  // Khai báo kiểu dữ liệu an toàn cho state nhận từ RentalBookingCard
  const state = location.state as {
    from?: { pathname: string; search: string };
    pendingBooking?: { deviceId: number; startDate: string; endDate: string };
  } | null;

  const from = state?.from;
  const redirectUrl = from ? `${from.pathname}${from.search}` : '/home';
  const pendingBooking = state?.pendingBooking;

  return useMutation({
    mutationFn: (loginData: LoginRequest) => {
      return api.auth.login(loginData);
    },

    onSuccess: async (user) => {
      loginSuccess({ username: user.username, roles: user.roles }, user.token);
      toast.success(`Welcome, ${user.username}!`);

      if (pendingBooking) {
        try {
          await addToCart(pendingBooking);
          navigate('/cart', { replace: true });
          return;
        } catch (error) {
          console.error('Lỗi tự động thêm vào giỏ hàng:', error);
          navigate('/cart', { replace: true });
          return;
        }
      }

      navigate(redirectUrl, { replace: true });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const appCode = error.response?.data?.appCode;
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';

      if (appCode === 2001) {
        toast.error('Bạn đã vượt quá số lần thử. Vui lòng xác minh CAPTCHA.');
        return;
      }

      toast.error(errorMsg);
    },
  });
};


export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (registerData: RegisterRequest) => {
      return api.auth.register(registerData);
    },

    onSuccess: (user) => {
      toast.success(`Registration successful! Welcome, ${user.username}!`);
      navigate('/login');
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    },
  });
};


export const useLogoutMutation = () => {
  const queryClient = useQueryClient(); // Lấy queryClient
  const logoutSuccess = useAuthStore((state) => state.logoutSuccess);

  return useMutation({
    mutationFn: async () => await api.auth.logout(),
    onSettled: () => {
      // 1. Xóa sạch cache của React Query
      queryClient.clear();

      // 2. Dọn dẹp Zustand
      logoutSuccess();

      // 3. Thông báo và điều hướng
      toast.success('Đăng xuất thành công.');
      window.location.href = '/login';
    },
  });
};


export const useForgotPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (email: ForgotPasswordRequest) => {
      return api.auth.forgotPassword(email);
    },

    onSuccess: () => {
      toast.success('Password reset email sent. Please check your inbox.');
      navigate('/login');
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Failed to send password reset email.';
      toast.error(errorMsg);
    },
  });
};

export const useResetPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, newPassword }: ResetPasswordRequest) => {
      return api.auth.resetPassword({ token, newPassword });
    },

    onSuccess: () => {
      toast.success('Password reset successfully. You can now log in.');
      navigate('/login');
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Failed to reset password.';
      toast.error(errorMsg);
    },
  });
};

export const useValidateTokenQuery = (token: string) => {
  return useQuery({
    queryKey: ['validateToken', token],
    queryFn: () => api.auth.validateToken(token),
    enabled: !!token,
  });
};

export const useValidateTokenMutation = () => {
  return useMutation({
    mutationFn: (token: string) => api.auth.validateToken(token),
  });
};


export const useCheckDuplicateEmail = (email: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['checkEmail', email],
    queryFn: () => api.auth.checkDuplicateEmail(email),
    enabled: !!email && options?.enabled !== false,
  });
};

export const useCheckDuplicateUsername = (username: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['checkUsername', username],
    queryFn: () => api.auth.checkDuplicateUsername(username),
    enabled: !!username && options?.enabled !== false,
  });
};

export const useSocialLogin = () => {
  const location = useLocation();

  const state = location.state as {
    from?: { pathname: string; search: string };
    pendingBooking?: { deviceId: number; startDate: string; endDate: string };
  } | null;

  const from = state?.from;
  const redirectUrl = from ? `${from.pathname}${from.search}` : '/home';
  const pendingBooking = state?.pendingBooking;

  const saveRedirectContext = () => {
    sessionStorage.setItem('redirectAfterLogin', redirectUrl);

    if (pendingBooking) {
      sessionStorage.setItem('pendingBooking', JSON.stringify(pendingBooking));
    } else {
      sessionStorage.removeItem('pendingBooking');
    }
  };

  const loginWithGoogle = () => {
    saveRedirectContext();
    window.location.href = api.auth.googleLoginUrl;
  };

  const loginWithFacebook = () => {
    saveRedirectContext();
    window.location.href = api.auth.facebookLoginUrl;
  };

  return { loginWithGoogle, loginWithFacebook };
};
