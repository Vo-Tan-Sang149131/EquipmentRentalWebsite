// @/components/layout/HeaderActions.tsx
import {
  LucideBell,
  LucideShoppingCart,
  LucideUser,
  LucideHistory,
  LucideLogOut,
  MessageSquare, // 1. Import thêm icon Chat ở đây
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Link } from 'react-router-dom';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/shared_components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared_components/ui/dropdown-menu';
import { useCart } from '@/features/cart/hooks/useCart.ts';
import { useLogoutMutation } from '@/features/auth/services/auth.service.ts';

export function HeaderActions() {
  // Get state from the store
  const { user, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogoutMutation();
  const isLoggingdOut = logoutMutation.isPending;

  const fallbackLetter = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  const { cartItemsCount } = useCart();

  // Get avatar URL from social login provider
  const avatarUrl = '';

  const onLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex items-center space-x-2 lg:space-x-4">
      <LucideBell className="text-gray-700 hover:text-gray-900 cursor-pointer h-5 w-5" />

      {/* 2. Thêm nút Chat vào đây (chỉ hiển thị khi đã đăng nhập thành công) */}
      {isAuthenticated && user && (
        <Link
          to="/messages"
          className="p-2 text-gray-600 hover:text-blue-600 transition"
          title="Tin nhắn"
        >
          <MessageSquare className="w-6 h-6" />
        </Link>
      )}

      <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition">
        <LucideShoppingCart className="w-6 h-6" />
        {cartItemsCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {cartItemsCount}
            </span>
        )}
      </Link>

      {isAuthenticated && user ? (
        <DropdownMenu>
          {/* Activate when clicking on the avatar image */}
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="h-9 w-9 border cursor-pointer hover:opacity-85 transition-opacity">
              <AvatarImage src={avatarUrl} alt={user.username} />
              <AvatarFallback className="bg-blue-500 text-white font-semibold">
                {fallbackLetter}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          {/* Dropdown menu content */}
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuGroup>
              <div className="px-1.5 py-1">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Xin chào, {user.username}</p>
                  <p className="pt-2 text-xs leading-none text-muted-foreground">
                    Quyền: {user.roles?.join(', ')}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              {/* User profile */}
              <DropdownMenuItem className="cursor-pointer">
                <Link to="/profile" className="w-full flex items-center">
                  <LucideUser className="mr-2 h-4 w-4" />
                  <span>Trang cá nhân</span>
                </Link>
              </DropdownMenuItem>

              {/* Rental history */}
              <DropdownMenuItem className="cursor-pointer">
                <Link to="/rental-history" className="w-full flex items-center">
                  <LucideHistory className="mr-2 h-4 w-4" />
                  <span>Lịch sử thuê đồ</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Logout button */}
              <DropdownMenuItem
                onClick={onLogout}
                disabled={isLoggingdOut}
                className="text-red-600 focus:text-red-600 focus:bg-red-50/50 cursor-pointer"
              >
                <LucideLogOut className="mr-2 h-4 w-4" />
                <span>
                  {isLoggingdOut ? 'Đang thoát...' : 'Đang xuất'}
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          to="/login"
          className="text-sm font-medium text-gray-700 hover:text-blue-600 border px-3 py-1.5 rounded-md transition-colors"
        >
          Đăng nhập
        </Link>
      )}
    </div>
  );
}
