import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Copy, ArrowLeft, Landmark } from 'lucide-react';
import { useState, useEffect } from 'react';

export function BankTransferPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. Bóc tách dữ liệu đơn hàng động từ URL do Hook useCheckout truyền sang
  const orderId = searchParams.get('orderId') || '';
  const amount = searchParams.get('amount') || '0';

  const [isCopied, setIsCopied] = useState(false);
  const [seconds, setSeconds] = useState(900); // 15 phút đếm ngược phiên thanh toán

  // Đếm ngược thời gian thanh toán
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 2. Logic sao chép nhanh nội dung chuyển khoản
  const memoText = `DH${orderId}`;
  const handleCopyMemo = () => {
    navigator.clipboard.writeText(memoText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 3. TẠO ĐƯỜNG LINK ẢNH VIETQR ĐỘNG MIỄN PHÍ
  // Thay thế thông tin ngân hàng và số tài khoản thực tế của bạn tại đây
  // Định dạng mẫu: vietinbank | mbbank | bidv | vcb
  const bankId = 'vietinbank';
  const accountNumber = '101123456789';
  const template = 'qr_only'; // Hiện duy nhất khung QR gọn gàng

  const vietQrUrl = `https://vietqr.io{bankId}-${accountNumber}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(memoText)}`;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 text-left">
      <div className="flex items-center space-x-2 mb-6">
        <button onClick={() => navigate('/checkout')}
                className="text-gray-500 hover:text-blue-600 transition flex items-center space-x-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> <span>Quay lại chọn phương thức khác</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8 bg-white border rounded-3xl p-8 shadow-sm items-start">

        {/* CỘT TRÁI: HIỂN THỊ MÃ QR ĐỂ KHÁCH QUÉT APP */}
        <div className="col-span-5 flex flex-col items-center border-r pr-8">
          <div className="bg-gray-50 p-4 rounded-2xl border flex items-center justify-center aspect-square w-full">
            {/* Ảnh QR động tự sinh từ VietQR API */}
            <img
              src={vietQrUrl}
              alt="Mã QR Chuyển khoản ngân hàng"
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
          <div className="mt-4 text-center space-y-1">
            <p className="text-xs text-gray-400 font-medium">Sử dụng ứng dụng Ngân hàng (Banking) để quét mã</p>
            <p className="text-xs text-amber-600 font-semibold bg-amber-50 px-3 py-1 rounded-full">
              Mã QR tự động điền số tiền & nội dung
            </p>
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT TÀI KHOẢN VÀ HƯỚNG DẪN CHUYỂN KHOẢN */}
        <div className="col-span-7 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Landmark className="w-6 h-6 text-blue-600" />
              <span>Chuyển khoản qua mã VietQR</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Vui lòng thanh toán đúng thông tin hệ thống cung cấp dưới đây.</p>
          </div>

          {/* Đồng hồ đếm ngược */}
          <div
            className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-center justify-between text-sm">
            <span className="text-blue-700 font-medium">Thời gian giữ lịch máy còn lại:</span>
            <span
              className="font-mono font-bold text-blue-600 bg-white border px-2.5 py-0.5 rounded shadow-sm text-base">
              {seconds > 0 ? formatTime(seconds) : 'Hết giờ'}
            </span>
          </div>

          {/* Chi tiết tài khoản đích */}
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-400">Ngân hàng thụ hưởng:</span>
              <span className="font-bold text-slate-800 uppercase">{bankId} (VietinBank)</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-400">Số tài khoản:</span>
              <span className="font-mono font-bold text-slate-800 tracking-wider">{accountNumber}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-400">Số tiền cần chuyển:</span>
              <span className="font-bold text-teal-600 text-base">{Number(amount).toLocaleString('vi-VN')} ₫</span>
            </div>

            {/* Nội dung bắt buộc - Cực kỳ quan trọng để đối soát hệ thống */}
            <div
              className="flex justify-between border-b pb-2 items-center bg-yellow-50/40 p-2 rounded-lg border border-dashed border-yellow-200">
              <span className="text-amber-800 font-medium">Nội dung chuyển khoản bắt buộc:</span>
              <div className="flex items-center space-x-2">
                <span
                  className="font-mono font-bold text-red-600 bg-white border border-red-200 px-2.5 py-1 rounded shadow-sm text-base">
                  {memoText}
                </span>
                <button
                  onClick={handleCopyMemo}
                  className="p-1.5 border bg-white rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                  title="Sao chép nội dung"
                >
                  {isCopied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Cảnh báo an toàn hệ thống */}
          <div className="flex items-start space-x-2 text-xs text-gray-400 bg-gray-50 p-3 rounded-xl leading-relaxed">
            <AlertCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <p>Hệ thống tự động quét lịch sử giao dịch mỗi 10 giây. Vui lòng giữ nguyên trang này hoặc không tắt trình
              duyệt cho đến khi nhận được thông báo "Thành công".</p>
          </div>

          {/* Nút giả lập hoàn tất (Phục vụ demo đồ án) */}
          <button
            onClick={() => navigate(`/checkout/success?orderId=${orderId}`)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold transition text-center block shadow-sm"
          >
            Tôi đã chuyển khoản thành công
          </button>
        </div>

      </div>
    </div>
  );
}
