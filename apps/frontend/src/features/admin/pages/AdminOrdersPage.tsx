import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import type { AdminOrder } from '../types/admin.types';
import SortableTable from '@/shared_components/ui/SortableTable.tsx';
import type { TableColumn } from '@/shared_components/ui/SortableTable.tsx';
import { ClipboardList, Calendar, XCircle, Search, Filter, AlertCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await adminService.getOrders();
      setOrders(response as unknown as AdminOrder[]);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách đơn hàng toàn hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm('Bạn chắc chắn muốn hủy đơn hàng này? Thao tác này không thể hoàn tác.')) return;
    try {
      await adminService.cancelOrder(id);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Hủy đơn hàng thất bại.');
    }
  };

  const filteredOrders = orders.filter(o =>
    o.orderId.toString().includes(searchTerm) ||
    o.renterUsername.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'PENDING_PAYMENT':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const columns: TableColumn<AdminOrder>[] = [
    {
      key: 'orderId',
      header: 'Đơn hàng',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">#{val as number}</span>
      ),
    },
    {
      key: 'renterUsername',
      header: 'Người thuê',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
            {(val as string).charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-slate-700">{val as string}</span>
        </div>
      ),
    },
    {
      key: 'startDate',
      header: 'Thời gian thuê',
      render: (_, row) => (
        <div className="flex flex-col text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {row.startDate}</span>
          <span className="ml-4">đến {row.endDate}</span>
        </div>
      ),
    },
    {
      key: 'totalPrice',
      header: 'Tổng tiền',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-teal-600">{new Intl.NumberFormat('vi-VN').format(val as number)}đ</span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (val) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(val as string)}`}>
          {val as string}
        </span>
      ),
    },
    {
      key: 'orderId',
      header: 'Thao tác',
      render: (_, row) => (
        <div className="flex space-x-2">
          {row.status !== 'CANCELLED' && (
            <button
              onClick={() => handleCancel(row.orderId)}
              className="flex items-center gap-1.5 text-red-600 hover:text-white hover:bg-red-600 border border-red-200 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>HỦY ĐƠN</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
          <p className="text-gray-500 mt-1">Theo dõi và can thiệp các giao dịch thuê máy trên toàn hệ thống.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <ClipboardList className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-bold text-slate-700">Tổng cộng: {orders.length} đơn</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, người thuê..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"
          />
        </div>
        <button
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-gray-600">
          <Filter className="w-4 h-4" />
          <span>Bộ lọc</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <SortableTable
          columns={columns}
          data={filteredOrders}
          rowKey="orderId"
          isLoading={loading}
          emptyMessage="Không tìm thấy đơn hàng nào trong hệ thống."
        />
      </div>
    </div>
  );
}
