import { useEffect, useState, useCallback } from 'react';
import { deviceService } from '../services/deviceService';
import type { Order } from '../types/device.types';
import type { SpringPageResponse } from '@/features/product/types/product.types.ts';
import ProductPagination from '@/features/product/components/Pagination.tsx';
import {
  ClipboardList,
  User,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
} from 'lucide-react';

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingOrder, setReportingOrder] = useState<number | null>(null);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res: SpringPageResponse<Order> = await deviceService.getOwnerOrders(p - 1, 10);
      setOrders(res.content || []);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirm = async (orderId: number) => {
    if (!window.confirm('Xác nhận đơn hàng này?')) return;
    setActionLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const response = await deviceService.confirmOrder(orderId);
      setOrders(orders.map(o => o.orderId === orderId ? response : o));
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Không thể xác nhận đơn hàng.');
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleReject = async (orderId: number) => {
    if (!window.confirm('Bạn chắc chắn muốn từ chối đơn hàng này?')) return;

    setActionLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const response = await deviceService.rejectOrder(orderId);
      setOrders(orders.map(o => o.orderId === orderId ? response : o));
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Không thể từ chối đơn hàng.');
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingOrder) return;

    try {
      await deviceService.reportIssue(reportingOrder, reportTitle, reportDescription);
      alert('Đã gửi báo cáo sự cố thành công.');
      setIsReportModalOpen(false);
      setReportTitle('');
      setReportDescription('');
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Không thể gửi báo cáo.');
    }
  };

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

  const filteredOrders = orders.filter(o =>
    o.orderId.toString().includes(searchTerm) ||
    o.renterUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.deviceNames?.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn thuê</h1>
          <p className="text-gray-500 mt-1">Theo dõi và xử lý các yêu cầu thuê thiết bị của bạn.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, khách hàng, thiết bị..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
          />
        </div>
        <button
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-gray-600">
          <Filter className="w-4 h-4" />
          <span>Lọc trạng thái</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Chưa có đơn hàng nào</h3>
          <p className="text-gray-500 mt-1">Các đơn hàng mới sẽ xuất hiện tại đây khi có người thuê.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(o => (
            <div key={o.orderId}
                 className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden group">
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">#{o.orderId}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusStyle(o.status)}`}>
                        {o.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg">
                      {o.deviceNames?.join(', ') || 'Thiết bị không xác định'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{o.renterUsername}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span>{new Date(o.startDate).toLocaleDateString('vi-VN')} - {new Date(o.endDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-gray-400">Tổng cộng:</span>
                        <span className="font-bold text-teal-600">{new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(o.totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:justify-center">
                    {o.status === 'PAID' && (
                      <button
                        onClick={() => handleConfirm(o.orderId)}
                        disabled={actionLoading[o.orderId]}
                        className="flex-1 lg:w-32 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{actionLoading[o.orderId] ? '...' : 'Xác nhận'}</span>
                      </button>
                    )}
                    {(o.status === 'PAID' || o.status === 'PENDING_PAYMENT') && (
                      <button
                        onClick={() => handleReject(o.orderId)}
                        disabled={actionLoading[o.orderId]}
                        className="flex-1 lg:w-32 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Từ chối</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setReportingOrder(o.orderId);
                        setIsReportModalOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition"
                      title="Báo cáo sự cố"
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && orders.length > 0 && (
        <ProductPagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-amber-50/50">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="text-xl font-bold">Báo cáo sự cố</h2>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleReportIssue} className="p-6 space-y-4 text-left">
              <p className="text-sm text-gray-500">Báo cáo các vấn đề liên quan đến đơn hàng <span
                className="font-bold text-gray-900">#{reportingOrder}</span>.</p>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Tiêu đề</label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  placeholder="Vd: Thiết bị hư hỏng, Khách trả trễ..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Chi tiết nội dung</label>
                <textarea
                  required
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  rows={4}
                  placeholder="Mô tả chi tiết tình trạng sự cố để Admin hỗ trợ xử lý..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-sm"
                >
                  Gửi báo cáo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


