import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore.ts';
import {
  Menu,
  X,
  LayoutDashboard,
  Box,
  ClipboardList,
  Calendar as CalendarIcon,
  Star,
  PlusCircle,
  User as UserIcon,
  LogOut,
  Home,
  Users,
  FolderTree,
  Tag,
  CreditCard,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

export function DashboardLayout() {
  const { user, logoutSuccess } = useAuthStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userRoles = Array.isArray(user?.roles) ? user.roles : [user?.roles || 'GUEST'];
  const isAdmin = userRoles.includes('ADMIN');

  const menuItems = isAdmin
    ? [
      { path: '/admin', label: 'Tổng quan', icon: <LayoutDashboard className="w-5 h-5" /> },
      { path: '/admin/users', label: 'Quản lý Người dùng', icon: <Users className="w-5 h-5" /> },
      { path: '/admin/devices', label: 'Quản lý Thiết bị', icon: <Box className="w-5 h-5" /> },
      { path: '/admin/categories', label: 'Quản lý Danh mục', icon: <FolderTree className="w-5 h-5" /> },
      { path: '/admin/brands', label: 'Quản lý Thương hiệu', icon: <Tag className="w-5 h-5" /> },
      { path: '/admin/orders', label: 'Quản lý Đơn thuê', icon: <ClipboardList className="w-5 h-5" /> },
      { path: '/admin/payments', label: 'Quản lý Giao dịch', icon: <CreditCard className="w-5 h-5" /> },
      { path: '/admin/issues', label: 'Quản lý Sự cố', icon: <AlertTriangle className="w-5 h-5" /> },
      { path: '/profile', label: 'Trang cá nhân', icon: <UserIcon className="w-5 h-5" /> },
    ]
    : [
      { path: '/dashboard', label: 'Tổng quan', icon: <LayoutDashboard className="w-5 h-5" /> },
      { path: '/dashboard/inventory', label: 'Kho thiết bị', icon: <Box className="w-5 h-5" /> },
      { path: '/dashboard/orders', label: 'Đơn đặt hàng', icon: <ClipboardList className="w-5 h-5" /> },
      { path: '/dashboard/calendar', label: 'Lịch cho thuê', icon: <CalendarIcon className="w-5 h-5" /> },
      { path: '/dashboard/reviews', label: 'Đánh giá phản hồi', icon: <Star className="w-5 h-5" /> },
      { path: '/register-device', label: 'Đăng ký thiết bị', icon: <PlusCircle className="w-5 h-5" /> },
      { path: '/profile', label: 'Trang cá nhân', icon: <UserIcon className="w-5 h-5" /> },
    ];

  const handleLogout = () => {
    logoutSuccess();
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Overlay cho mobile khi sidebar mở */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* 1. Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 transform
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold tracking-wider text-sm">{isAdmin ? 'ADMIN PANEL' : 'OWNER HUB'}</span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/30">
            <div className="flex items-center space-x-3 mb-4 px-2">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-inner">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div
                  className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-white">{user?.username || 'User'}</p>
                <p
                  className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">{isAdmin ? 'Administrator' : 'Equipment Owner'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header Area */}
        <header
          className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-30 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Bảng điều khiển'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/home"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Về Trang chủ</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Content Region */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// Thêm ShieldCheck import để không bị lỗi
function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
