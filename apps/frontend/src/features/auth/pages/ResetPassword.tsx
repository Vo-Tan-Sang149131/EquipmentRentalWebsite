import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { passwordRegex } from '@/features/auth/utils/auth.utils.ts';
import {
  useResetPasswordMutation,
  useValidateTokenMutation,
  useValidateTokenQuery,
} from '@/features/auth/services/auth.service.ts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(passwordRegex, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    confirmNewPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(passwordRegex, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
      });
    }
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetToken = searchParams.get('token');

  // 1. Validate token when the page loading
  const { data: isTokenValid, isLoading } = useValidateTokenQuery(resetToken || '');

  // 2. Mutation for double check when submit
  const validateTokenMutation = useValidateTokenMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid: isFormValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const isSubmitDisabled =
    !resetToken || !isDirty || !isFormValid || isSubmitting || resetPasswordMutation.isPending;

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!resetToken) return;

    try {
      const stillValid = await validateTokenMutation.mutateAsync(resetToken);
      if (!stillValid) {
        toast.error('Token đã hết hạn hoặc không hợp lệ.');
        navigate('/forgot-password');
        return;
      }

      // If valid, call reset password action
      resetPasswordMutation.mutate({
        token: resetToken,
        newPassword: data.newPassword,
      });
    } catch {
      toast.error('Token không hợp lệ hoặc đã hết hạn.');
      navigate('/forgot-password');
    }
  };

  if (isLoading) return <p>Đang kiểm tra token...</p>;
  if (!isTokenValid) {
    toast.error('Link reset đã hết hạn hoặc đã được sử dụng.');
    navigate('/forgot-password');
    return null;
  }

  return (
    <div
      className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side */}
        <div className="relative hidden md:flex">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
            alt="Reset Password"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-10 text-white">
            <h2 className="text-4xl font-bold mb-3">Create New Password</h2>

            <p className="text-gray-200 text-sm leading-relaxed">
              Your new password should be strong and secure to protect your account.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>

              <p className="text-gray-500 mt-2 leading-relaxed">Enter your new password below.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {!resetToken && (
                <div
                  className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong className="font-bold">
                    Token is outdated or invalid. Please request a new password reset.
                  </strong>
                </div>
              )}
              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>

                <input
                  type="password"
                  id="newPassword"
                  {...register('newPassword')}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-left text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmNewPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>

                <input
                  type="password"
                  id="confirmNewPassword"
                  {...register('confirmNewPassword')}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
                {errors.confirmNewPassword && (
                  <p className="text-red-500 text-left text-sm mt-1">
                    {errors.confirmNewPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg ${
                  isSubmitDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-indigo-700 hover:shadow-indigo-200'
                }`}
              >
                {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <Link to="/login" className="text-sm text-indigo-600 hover:underline font-medium">
                ← Back to Login
              </Link>
            </div>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                Make sure your password contains uppercase, lowercase, numbers, and special
                characters for better security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
