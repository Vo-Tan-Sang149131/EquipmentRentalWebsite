import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import type { DashboardStats } from '../types/admin.types';
import {
  Users,
  Store,
  Camera,
  DollarSign,
  ClipboardList,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data as unknown as DashboardStats);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        setError('Không thể tải dữ liệu thống kê hệ thống.');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }: {
    title: string;
    value: number | string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    color: string;
    trend?: string
  }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <p className="text-xs font-medium text-green-600 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản trị Hệ thống</h1>
        <p className="text-gray-500 mt-1">Theo dõi toàn bộ hoạt động kinh doanh và người dùng trên nền tảng.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-32" />
          ))
        ) : stats ? (
          <>
            <StatCard title="Người dùng" value={stats.totalUsers} icon={Users} color="bg-blue-500"
                      trend="+4% tháng này" />
            <StatCard title="Chủ máy" value={stats.totalOwners} icon={Store} color="bg-indigo-500"
                      trend="+2% tháng này" />
            <StatCard title="Thiết bị" value={stats.totalDevices} icon={Camera} color="bg-orange-500" />
            <StatCard title="Doanh thu" value={new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(stats.totalRevenue)} icon={DollarSign} color="bg-emerald-500" trend="+15%" />
            <StatCard title="Tổng đơn hàng" value={stats.totalOrders} icon={ClipboardList} color="bg-violet-500" />
            <StatCard title="Đang trực tuyến" value={stats.activeUsers} icon={Activity} color="bg-slate-500" />
          </>
        ) : null}
      </div>

      {/* Management Panels */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Khu vực Quản lý</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/users"
            className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition group"
          >
            <div
              className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900">Người dùng & Phân quyền</h3>
            <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản, khóa/mở tài khoản và thay đổi vai trò.</p>
          </Link>

          <Link
            to="/admin/devices"
            className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition group"
          >
            <div
              className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900">Kiểm duyệt Thiết bị</h3>
            <p className="text-sm text-gray-500 mt-1">Xem xét và phê duyệt các thiết bị mới được đăng tải.</p>
          </Link>

          <Link
            to="/admin/issues"
            className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition group"
          >
            <div
              className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900">Xử lý Sự cố</h3>
            <p className="text-sm text-gray-500 mt-1">Tiếp nhận và giải quyết các khiếu nại từ Owner và Renter.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

