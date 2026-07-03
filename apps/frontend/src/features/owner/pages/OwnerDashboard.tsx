import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deviceService } from '../services/deviceService';
import type { OwnerStats } from '../types/device.types';
import { Package, Calendar, ClipboardList, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function OwnerDashboard() {
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await deviceService.getOwnerStats();
        setStats(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        setError('Không thể tải dữ liệu thống kê bảng điều khiển.');
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
            <TrendingUp className="w-3 h-3" /> {trend}
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển Chủ máy</h1>
          <p className="text-gray-500 mt-1">Tổng quan về hiệu quả kinh doanh và thiết bị của bạn.</p>
        </div>
        <Link
          to="/dashboard/inventory"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          <span>Đăng thiết bị mới</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-32" />
          ))
        ) : stats ? (
          <>
            <StatCard
              title="Tổng đơn hàng"
              value={stats.totalOrders}
              icon={ClipboardList}
              color="bg-blue-500"
              trend="+12% so với tháng trước"
            />
            <StatCard
              title="Đơn chờ xử lý"
              value={stats.pendingOrders}
              icon={Clock}
              color="bg-amber-500"
            />
            <StatCard
              title="Đang hoạt động"
              value={stats.activeRentals}
              icon={CheckCircle}
              color="bg-green-500"
            />
            <StatCard
              title="Doanh thu tạm tính"
              value={new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(stats.totalRevenue || 0)}
              icon={TrendingUp}
              color="bg-indigo-500"
            />
          </>
        ) : null}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Lối tắt quản lý</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/dashboard/inventory"
            className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition group"
          >
            <div
              className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900">Quản lý Kho</h3>
            <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin, giá thuê và trạng thái các thiết bị.</p>
          </Link>

          <Link
            to="/dashboard/calendar"
            className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition group"
          >
            <div
              className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900">Lịch bận thiết bị</h3>
            <p className="text-sm text-gray-500 mt-1">Xem lịch đã đặt và chủ động chặn ngày bận của thiết bị.</p>
          </Link>

          <Link
            to="/dashboard/orders"
            className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 transition group"
          >
            <div
              className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900">Quản lý Đơn thuê</h3>
            <p className="text-sm text-gray-500 mt-1">Xử lý các yêu cầu thuê mới và theo dõi trạng thái bàn giao.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}


