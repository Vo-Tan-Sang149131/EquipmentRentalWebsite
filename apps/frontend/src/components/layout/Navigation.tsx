// @/components/layout/Navigation.tsx
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export function Navigation() {
  const { user } = useAuthStore();
  const userRoles = Array.isArray(user?.roles) ? user.roles : [user?.roles || 'GUEST'];

  const isOwner = userRoles.includes('OWNER');
  const isAdmin = userRoles.includes('ADMIN');

  return (
    <ul className="hidden lg:flex space-x-4 items-center">
      <li><Link to="/home" className="text-gray-700 hover:underline">Trang chủ</Link></li>
      <li><Link to="/products" className="text-gray-700 hover:underline">Sản phẩm</Link></li>

      {/* Nếu là OWNER hoặc ADMIN, hiển thị một nút đi vào khu quản trị nhanh */}
      {isOwner && (
        <li>
          <Link to="/dashboard" className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-sm">
            Khu vực Chủ máy 🛠️
          </Link>
        </li>
      )}
      {isAdmin && (
        <li>
          <Link to="/admin/users" className="bg-slate-800 text-white px-3 py-1.5 rounded-md hover:bg-slate-900 text-sm">
            Hệ thống Admin 🛡️
          </Link>
        </li>
      )}
    </ul>
  );
}
