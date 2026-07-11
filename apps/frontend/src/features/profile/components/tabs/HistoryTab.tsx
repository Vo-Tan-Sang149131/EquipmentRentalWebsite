import { LucideHistory, Package, Calendar, Tag, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useGetMyOrdersQuery } from '../../services/profile.service';

export function HistoryTab() {
  const { data: orders, isLoading } = useGetMyOrdersQuery();

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'CONFIRMED':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'CANCELLED':
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-start gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 shadow-sm border border-violet-100">
          <LucideHistory className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Lịch sử thuê thiết bị
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi danh sách các đơn hàng và trạng thái thuê của bạn.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Package className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Bạn chưa có đơn thuê nào</h3>
          <p className="text-slate-500 mt-1 max-w-xs mx-auto">Hãy khám phá các thiết bị nhiếp ảnh chuyên nghiệp và bắt
            đầu hành trình của bạn.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {orders.map((order: any) => (
            <div key={order.orderId}
                 className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">#{order.orderId}</span>
                    <span
                      className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusStyle(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                    {order.deviceNames?.join(', ')}
                  </h4>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{new Date(order.startDate).toLocaleDateString('vi-VN')} - {new Date(order.endDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-slate-400" />
                      <span className="font-bold text-teal-600">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(order.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <button
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors">
                    Chi tiết
                  </button>
                  {order.status === 'PAID' && (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase">
                      <CheckCircle2 className="w-3 h-3" />
                      Đã thanh toán
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
