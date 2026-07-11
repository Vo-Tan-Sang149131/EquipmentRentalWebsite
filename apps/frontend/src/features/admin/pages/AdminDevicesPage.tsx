import { useEffect, useState, useCallback } from 'react';
import { adminService } from '../services/adminService';
import type { AdminDevice } from '../types/admin.types';
import SortableTable from '@/shared_components/ui/SortableTable.tsx';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared_components/ui/pagination';
import { usePagination } from '@/shared_components/hooks/usePagination.ts';
import type { TableColumn } from '@/shared_components/ui/SortableTable.tsx';
import { Camera, CheckCircle2, AlertCircle, ShieldCheck, Search, Filter } from 'lucide-react';

type Device = AdminDevice;

interface SortConfig {
  key: keyof Device;
  order: 'ASC' | 'DESC';
}

export default function AdminDevicesPage() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [displayedDevices, setDisplayedDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortConfig | null>(null);
  const [approving, setApproving] = useState<number | null>(null);
  const [uiFeedback, setUiFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });
  const { currentPage, pageSize, handlePageChange } = pagination;

  const applySortAndPaginate = useCallback((
    sourceDevices: Device[],
    appliedSort: SortConfig | null,
    page: number,
    size: number,
  ) => {
    let result = [...sourceDevices];

    if (searchTerm) {
      result = result.filter(d =>
        d.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (appliedSort) {
      result.sort((a, b) => {
        const aVal = a[appliedSort.key];
        const bVal = b[appliedSort.key];
        if (aVal === bVal) return 0;
        if (aVal < bVal) return appliedSort.order === 'ASC' ? -1 : 1;
        return appliedSort.order === 'ASC' ? 1 : -1;
      });
    }

    const start = (page - 1) * size;
    setDisplayedDevices(result.slice(start, start + size));
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    adminService.getPendingDevices()
      .then((response) => {
        setAllDevices(response as unknown as AdminDevice[]);
      })
      .catch((_err: unknown) => {
        console.error(_err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    applySortAndPaginate(allDevices, sort, currentPage, pageSize);
  }, [allDevices, sort, currentPage, pageSize, applySortAndPaginate]);

  const handleSort = (key: string, order: 'ASC' | 'DESC') => {
    setSort({ key: key as keyof Device, order });
  };

  const handleApprove = async (id: number) => {
    if (!window.confirm('Phê duyệt thiết bị này vào hệ thống?')) return;
    setApproving(id);
    setUiFeedback(null);
    try {
      await adminService.approveDevice(id);
      setAllDevices(prev => prev.filter(d => d.id !== id));
      setUiFeedback({ type: 'success', message: 'Đã phê duyệt thiết bị thành công!' });
      setTimeout(() => setUiFeedback(null), 3000);
    } catch (_err) {
      console.error(_err);
      setUiFeedback({ type: 'error', message: 'Phê duyệt thiết bị thất bại.' });
    } finally {
      setApproving(null);
    }
  };

  const columns: TableColumn<Device>[] = [
    {
      key: 'productName',
      header: 'Thiết bị',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            <Camera className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">{val as string}</span>
            <span className="text-[11px] text-slate-400 font-medium">ID: {row.id}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'serialNumber',
      header: 'Số Serial (S/N)',
      sortable: true,
      render: (val: unknown) => (
        <code className="text-[11px] bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-200 font-mono">
          {val as string}
        </code>
      ),
    },
    {
      key: 'pricePerDay',
      header: 'Giá thuê / ngày',
      sortable: true,
      render: (val: unknown) => (
        <span className="font-bold text-emerald-600">{new Intl.NumberFormat('vi-VN').format(val as number)}đ</span>
      ),
    },
    {
      key: 'depositValue',
      header: 'Tiền cọc',
      sortable: true,
      render: (val: unknown) => (
        <span className="font-medium text-slate-500">{new Intl.NumberFormat('vi-VN').format(val as number)}đ</span>
      ),
    },
    {
      key: 'status',
      header: 'Thao tác',
      render: (_val: unknown, row) => (
        <button
          onClick={() => handleApprove(row.id)}
          disabled={approving === row.id}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-sm transition-all"
        >
          {approving === row.id ? (
            <span className="animate-spin">🔄</span>
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          <span>DUYỆT</span>
        </button>
      ),
    },
  ];

  const totalPages = Math.ceil(allDevices.filter(d =>
    d.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  ).length / pageSize);

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={currentPage === i}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    if (totalPages > 5) pages.push(<PaginationItem key="el"><PaginationEllipsis /></PaginationItem>);
    return pages;
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kiểm duyệt thiết bị</h1>
          <p className="text-gray-500 mt-1">Phê duyệt các thiết bị mới được đăng tải để xuất hiện trên cửa hàng.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-4 py-2 border-r border-slate-100">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chờ duyệt</span>
            <span className="text-lg font-bold text-amber-600">{allDevices.length} máy</span>
          </div>
          <div className="px-4 py-2 flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-tight">Khu vực bảo mật</span>
          </div>
        </div>
      </div>

      {uiFeedback && (
        <div className={`p-4 rounded-2xl text-sm font-bold border flex items-center gap-3 shadow-sm ${
          uiFeedback.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
        }`}>
          {uiFeedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {uiFeedback.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm thiết bị, số serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white"
          />
        </div>
        <button
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-gray-600">
          <Filter className="w-4 h-4" />
          <span>Trạng thái</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <SortableTable
          columns={columns}
          data={displayedDevices}
          rowKey="id"
          onSort={handleSort}
          currentSort={sort}
          isLoading={loading}
          emptyMessage="Tuyệt vời! Không còn thiết bị nào đang chờ phê duyệt."
        />
      </div>

      {allDevices.length > 0 && totalPages > 1 && (
        <div className="flex justify-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-40' : ''}
                />
              </PaginationItem>
              {renderPageNumbers()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-40' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
