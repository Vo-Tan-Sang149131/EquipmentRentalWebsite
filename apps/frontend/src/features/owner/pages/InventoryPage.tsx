import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { deviceService } from '../services/deviceService.ts';
import type { DeviceManage } from '../types/device.types.ts';
import type { SpringPageResponse } from '@/features/product/types/product.types.ts';
import ProductPagination from '@/features/product/components/Pagination.tsx';
import { Package, Plus, Search, Edit2, AlertCircle, Camera, Banknote, ShieldCheck, Clock } from 'lucide-react';

export default function InventoryPage() {
  const [items, setItems] = useState<DeviceManage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPage = useCallback((p: number) => {
    setLoading(true);
    deviceService.getMyInventory(p - 1, 8)
      .then((res: SpringPageResponse<DeviceManage>) => {
        setItems(res.content);
        setTotalPages(res.totalPages);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError('Không thể tải danh sách thiết bị từ kho.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'PENDING_APPROVAL':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'REJECTED':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const filteredItems = items.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kho Thiết bị của tôi</h1>
          <p className="text-gray-500 mt-1">Quản lý danh sách, giá thuê và trạng thái các thiết bị đang kinh doanh.</p>
        </div>
        <Link
          to="/register-device"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm thiết bị mới</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên máy, số serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Kho hàng đang trống</h3>
          <p className="text-gray-500 mt-1">Hãy bắt đầu kinh doanh bằng cách đăng tải thiết bị đầu tiên.</p>
          <Link to="/register-device" className="mt-4 inline-flex text-blue-600 font-bold hover:underline">
            Đăng ký thiết bị ngay
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map(item => (
            <div key={item.id}
                 className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col group">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{item.productName}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">S/N: {item.serialNumber}</p>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusStyle(item.status)}`}>
                    {item.status === 'APPROVED' ? 'ĐÃ DUYỆT' :
                      item.status === 'PENDING_APPROVAL' ? 'CHỜ DUYỆT' : 'BỊ TỪ CHỐI'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Giá thuê</p>
                      <p
                        className="text-sm font-bold text-gray-900">{new Intl.NumberFormat('vi-VN').format(item.pricePerDay)}đ</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tiền cọc</p>
                      <p
                        className="text-sm font-bold text-gray-900">{new Intl.NumberFormat('vi-VN').format(item.depositValue)}đ</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tình trạng</p>
                      <p className="text-sm font-bold text-gray-900">{item.conditionPercent}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hình ảnh</p>
                      <p className="text-sm font-bold text-gray-900">4 ảnh</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <Link
                  to={`/dashboard/device/${item.id}/edit`}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition shadow-sm text-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Chỉnh sửa thiết bị
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && items.length > 0 && (
        <ProductPagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}
