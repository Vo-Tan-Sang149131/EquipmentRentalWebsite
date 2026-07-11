// @/features/profile/services/profile.service.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { toast } from 'sonner';
import type {
  BasicProfileRequest,
  ChangePasswordRequest,
  KycVerificationRequest, RevealKycRequest,
} from '@/features/profile/types/profile.type.ts';

export const useGetProfileQuery = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: () => api.profile.getMe(),
    staleTime: 1000 * 60 * 5, // Use staleTime to cache the data for 5 minutes
  });
};

export const useUpdateBasicProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BasicProfileRequest) => {
      const formData = new FormData();
      if (data.phoneNumber !== null)
        formData.append('phoneNumber', data.phoneNumber);

      if (data.avatarFile)
        formData.append('avatarFile', data.avatarFile);

      if (data.gender !== null)
        formData.append('gender', data.gender);

      if (data.dob !== null)
        formData.append('dob', data.dob);

      if (data.address !== null)
        formData.append('address', data.address);

      if (data.bio !== null)
        formData.append('bio', data.bio);
      return api.profile.updateBasic(formData);
    },
    onSuccess: () => {
      toast.success('Cập nhật thông tin cơ bản thành công!');
      queryClient.invalidateQueries({ queryKey: ['user-profile'] }).then(r => {
        console.log('refetch user profile', r);
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Không thể cập nhật thông tin.';
      toast.error(errorMsg);
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => {
      return api.profile.changePassword(data);
    },
    onSuccess: () => {
      toast.success('Thay đổi mật khẩu tài khoản thành công!');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Mật khẩu cũ không chính xác hoặc dữ liệu không hợp lệ.';
      toast.error(errorMsg);
    },
  });
};

export const useVerifyKycMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: KycVerificationRequest) => {
      const formData = new FormData();
      formData.append('idCardNumber', data.kycCardNumber);
      if (data.kycCardFrontFile) formData.append('idCardFrontFile', data.kycCardFrontFile);
      if (data.kycCardBackFile) formData.append('idCardBackFile', data.kycCardBackFile);
      return api.profile.verifyKyc(formData);
    },
    onSuccess: () => {
      toast.success('Đã gửi yêu cầu KYC, vui lòng chờ Admin phê duyệt!');
      queryClient.invalidateQueries({ queryKey: ['user-profile'] }).then(r => {
        console.log('refetch user profile', r);
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Yêu cầu KYC thất bại hoặc bạn đang có yêu cầu chờ duyệt.';
      toast.error(errorMsg);
    },
  });
};

export const useRevealKycMutation = () => {

  return useMutation({
    mutationFn: (data: RevealKycRequest) => {
      return api.profile.revealKyc(data);
    },
    onSuccess: () => {
      toast.success('Hiển thị thông tin số CCCD thành công');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Đã xảy ra trong quá trình hiển thị.';
      toast.error(errorMsg);
    },
  });
};

export const useGetMyOrdersQuery = () => {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.profile.getMyOrders(),
  });
};
