import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import type { Payment } from '../types/admin.types';
import SortableTable from '@/shared_components/ui/SortableTable.tsx';
import type { TableColumn } from '@/shared_components/ui/SortableTable.tsx';
import { Wallet, CreditCard, Calendar, Search, Filter, AlertCircle } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await adminService.getPayments();
      setPayments(response as unknown as Payment[]);
    } catch (err) {
      console.error(err);
      setError('Không thể tải lịch sử giao dịch thanh toán.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(p =>
    p.id.toString().includes(searchTerm) ||
    p.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.paymentToken?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'FAILED':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const columns: TableColumn<Payment>[] = [
    {
      key: 'id',
      header: 'Giao dịch',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-slate-900">#{val as number}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Số tiền',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-teal-600">{new Intl.NumberFormat('vi-VN').format(val as number)}đ</span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Phương thức',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <CreditCard className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-medium text-slate-700">{val as string}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (val) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(val as string)}`}>
          {val as string === 'SUCCESS' ? 'THÀNH CÔNG' : val as string}
        </span>
      ),
    },
    {
      key: 'paymentToken',
      header: 'Mã Token',
      render: (v) => <code
        className="text-[10px] text-slate-400 truncate max-w-[120px] block font-mono">{v as string || 'N/A'}</code>,
    },
    {
      key: 'createdAt',
      header: 'Ngày tạo',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(val as string).toLocaleDateString('vi-VN')}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch sử Giao dịch</h1>
          <p className="text-gray-500 mt-1">Quản lý và đối soát dòng tiền thanh toán trên hệ thống.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <Wallet className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-bold text-slate-700">Tổng doanh thu hệ thống</span>
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
            placeholder="Tìm theo ID, Token, Phương thức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"
          />
        </div>
        <button
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-gray-600">
          <Filter className="w-4 h-4" />
          <span>Thời gian</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <SortableTable
          columns={columns}
          data={filteredPayments}
          rowKey="id"
          isLoading={loading}
          emptyMessage="Chưa ghi nhận bất kỳ giao dịch thanh toán nào."
        />
      </div>
    </div>
  );
}
