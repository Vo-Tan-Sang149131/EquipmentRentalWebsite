import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function VnPayCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');
    const vnp_TxnRef = searchParams.get('vnp_TxnRef');
    const vnp_Amount = searchParams.get('vnp_Amount');

    if (vnp_ResponseCode === '00') {
      setStatus('success');
    } else {
      setStatus('failed');
    }
  }, [searchParams]);

  if (status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500">Đang xác nhận giao dịch...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-lg mx-auto px-6 text-center space-y-6">
      {status === 'success' ? (
        <>
          <div className="bg-emerald-50 p-4 rounded-full border border-emerald-100">
            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Thanh toán thành công!</h1>
          <p className="text-gray-500">Mã giao dịch: {searchParams.get('vnp_TransactionNo')}</p>
          <button onClick={() => navigate('/profile')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold">
            Xem lịch sử đơn hàng
          </button>
        </>
      ) : (
        <>
          <div className="bg-red-50 p-4 rounded-full border border-red-100">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Thanh toán thất bại</h1>
          <p className="text-gray-500">Mã lỗi: {searchParams.get('vnp_ResponseCode')}</p>
          <button onClick={() => navigate('/checkout')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold">
            Thử lại
          </button>
        </>
      )}
    </div>
  );
}
