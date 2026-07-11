// @/features/admin/pages/AdminUserDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import type { User } from '../types/admin.types';

const AVAILABLE_ROLES = ['RENTER', 'OWNER', 'ADMIN'];

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = id ? parseInt(id) : null;

  const [user, setUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Quản lý trạng thái thông báo trực quan thay cho hàm alert() mặc định của trình duyệt
  const [uiFeedback, setUiFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!userId) {
      setUiFeedback({ type: 'error', message: 'Mã định danh người dùng không hợp lệ.' });
      setTimeout(() => navigate('/admin/users'), 2000);
      return;
    }

    adminService.getUserDetail(userId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        const resolvedData = data as User;
        setUser(resolvedData);
        // data.roles might be an array of strings or a Set depending on the response
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSelectedRoles(new Set((resolvedData as any).roles || []));
      })
      .catch(err => {
        console.error(err);
        setUiFeedback({ type: 'error', message: 'Không thể tải thông tin chi tiết của người dùng này.' });
      })
      .finally(() => setLoading(false));
  }, [userId, navigate]);

  const toggleRole = (role: string) => {
    const newRoles = new Set(selectedRoles);
    if (newRoles.has(role)) {
      newRoles.delete(role);
    } else {
      newRoles.add(role);
    }
    setSelectedRoles(newRoles);
  };

  const handleSave = async () => {
    if (!userId) return;

    if (selectedRoles.size === 0) {
      setUiFeedback({ type: 'error', message: 'Tài khoản người dùng bắt buộc phải sở hữu ít nhất một vai trò.' });
      return;
    }

    try {
      setSaving(true);
      setUiFeedback(null);
      await adminService.updateUserRoles(userId, Array.from(selectedRoles));
      setUiFeedback({ type: 'success', message: 'Cập nhật phân quyền tài khoản thành công!' });

      // Chờ hiển thị thông báo thành công trong 1.5 giây trước khi chuyển trang
      setTimeout(() => {
        navigate('/admin/users');
      }, 1500);
    } catch (err) {
      console.error(err);
      setUiFeedback({ type: 'error', message: 'Lưu thay đổi thất bại. Vui lòng thử lại sau.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="flex items-center space-x-2 text-slate-500 font-medium text-sm animate-pulse">
          <span>🔄</span> <span>Đang tải thông tin tài khoản...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm max-w-xl mx-auto mt-8 flex items-center space-x-2">
        <span>⚠️</span>
        <span>Không tìm thấy thông tin thành viên này trong hệ thống.</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Nút Quay lại */}
      <div>
        <button
          onClick={() => navigate('/admin/users')}
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách
        </button>
      </div>

      {/* Khối thông báo Feedback */}
      {uiFeedback && (
        <div className={`p-4 rounded-xl text-sm border flex items-center space-x-2 shadow-sm animate-fadeIn ${
          uiFeedback.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <span>{uiFeedback.type === 'success' ? '✅' : '⚠️'}</span>
          <span className="font-medium">{uiFeedback.message}</span>
        </div>
      )}

      {/* Form Cấu hình chính */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Cột Bên Trái: Thông tin chung của tài khoản */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Thông tin tài khoản</h2>

          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div
              className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg border border-slate-200">
              {user.fullName?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <h3 className="font-bold text-slate-900 truncate">{user.fullName || 'Chưa cập nhật'}</h3>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <p className="text-xs text-slate-500">ID tài khoản: #{user.userId || (user as any).id}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="block text-slate-400 text-xs font-medium">Tên đăng nhập (Username)</span>
              <span className="font-medium text-slate-800">@{user.username}</span>
            </div>
            <div>
              <span className="block text-slate-400 text-xs font-medium">Hộp thư điện tử (Email)</span>
              <span className="font-medium text-slate-800 break-all">{user.email}</span>
            </div>
            <div>
              <span className="block text-slate-400 text-xs font-medium">Trạng thái hệ thống</span>
              <span
                className={`inline-flex items-center gap-1.5 font-semibold text-xs px-2.5 py-0.5 rounded-full mt-1 ${
                  user.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                <span className={`w-1 h-1 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {user.active ? 'Đang hoạt động' : 'Tạm dừng'}
              </span>
            </div>
          </div>
        </div>

        {/* Cột Bên Phải: Phân quyền vai trò mới */}
        <div
          className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Thiết lập quyền hạn</h2>
              <p className="text-slate-500 text-xs mt-0.5">Tích chọn các vai trò tương ứng để cấp hoặc thu hồi quyền
                truy cập hệ thống của thành viên này.</p>
            </div>

            {/* Checkbox Roles với giao diện Card nhỏ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_ROLES.map(role => {
                const isChecked = selectedRoles.has(role);
                return (
                  <label
                    key={role}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isChecked
                        ? 'border-blue-600 bg-blue-50/40 text-blue-900 shadow-sm'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleRole(role)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="font-semibold text-sm tracking-wide">{role}</span>
                    </div>
                    {role === 'ADMIN' && <span
                      className="text-xs font-medium px-2 py-0.5 bg-slate-900 text-slate-100 rounded">Hệ thống</span>}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Thanh hiển thị quyền đang chọn nhanh */}
          <div className="space-y-4 border-t border-slate-100 pt-5">
            <div
              className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 flex items-center justify-between">
              <span>Vai trò sẽ áp dụng:</span>
              <span className="font-bold text-slate-900">
                {selectedRoles.size > 0 ? Array.from(selectedRoles).join(', ') : 'Chưa chọn (Vui lòng gán 1 quyền)'}
              </span>
            </div>

            {/* Thanh chứa các nút nhấn hành động */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => navigate('/admin/users')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/10 transition-all flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <span className="animate-spin">🔄</span>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <span>Lưu thay đổi</span>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
