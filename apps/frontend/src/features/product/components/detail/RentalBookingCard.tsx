import { useState, useMemo } from 'react';
import { differenceInDays, isBefore, startOfDay, parseISO, isSameDay, format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart.ts';
import { useAuthStore } from '@/store/useAuthStore.ts';

interface RentalBookingCardProps {
  pricePerDay: number;
  depositValue: number;
  insurance: number;
  availability: string;
  bookDates: string[];
  deviceId: number;
}

export function RentalBookingCard({
                                    pricePerDay,
                                    depositValue,
                                    insurance,
                                    availability,
                                    bookDates = [],
                                    deviceId,
                                  }: RentalBookingCardProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const navigate = useNavigate();
  const { addToCart, isAdding } = useCart();

  const location = useLocation();


  const disabledDates = useMemo(() => {
    return bookDates.map(dateStr => startOfDay(parseISO(dateStr)));
  }, [bookDates]);

  const hasBlockedDateInRange = (start: Date, end: Date) => {
    return disabledDates.some(disabledDate =>
      isSameDay(disabledDate, start) ||
      isSameDay(disabledDate, end) ||
      (isBefore(start, disabledDate) && isBefore(disabledDate, end)),
    );
  };

  const rentalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    if (isSameDay(startDate, endDate)) return 1;
    const days = differenceInDays(endDate, startDate);
    return days < 0 ? 0 : days + 1;
  }, [startDate, endDate]);

  const rentalFee = rentalDays * pricePerDay;
  const totalAmount = rentalFee + depositValue + insurance;

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert('Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc!');
      return;
    }
    const bookingData = {
      deviceId,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
    };

    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: location,
          pendingBooking: bookingData,
        },
      });
      return;
    }

    try {
      await addToCart(bookingData);
      navigate('/cart');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Có lỗi xảy ra!';
      alert(errorMsg);
    }
  };

  const isRentable = availability === 'AVAILABLE';
  const hasSelectedDates = startDate && endDate;

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
      <div className="flex items-baseline justify-between border-b pb-4">
        <span className="text-2xl font-bold text-teal-600">
          {pricePerDay.toLocaleString('vi-VN')} ₫ <span className="text-sm font-normal text-gray-400">/ngày</span>
        </span>
        <span
          className={`text-xs px-2 py-1 rounded font-medium ${isRentable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isRentable ? 'Sẵn sàng' : 'Không khả dụng'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 relative">
        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1">Ngày nhận máy</label>
          <button
            type="button"
            disabled={!isRentable}
            onClick={() => setShowStartPicker(!showStartPicker)}
            className="w-full border rounded-lg p-2 text-sm text-left bg-white focus:outline-blue-500"
          >
            {startDate ? format(startDate, 'dd/MM/yyyy') : 'Chọn ngày nhận'}
          </button>

          {showStartPicker && (
            <div
              className="fixed inset-x-0 bottom-0 z-[100] md:absolute md:inset-auto md:z-50 bg-white border md:rounded-xl shadow-2xl md:shadow-xl mt-1 p-2 flex justify-center">
              <div className="bg-white">
                <DayPicker
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    setShowStartPicker(false);
                    if (endDate && date && !isBefore(date, endDate)) setEndDate(undefined);
                  }}
                  disabled={[
                    { before: startOfDay(new Date()) },
                    ...disabledDates,
                  ]}
                />
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 mb-1">Ngày trả máy</label>
          <button
            type="button"
            disabled={!startDate || !isRentable}
            onClick={() => setShowEndPicker(!showEndPicker)}
            className="w-full border rounded-lg p-2 text-sm text-left bg-white focus:outline-blue-500 disabled:bg-gray-50"
          >
            {endDate ? format(endDate, 'dd/MM/yyyy') : 'Chọn ngày trả'}
          </button>

          {showEndPicker && startDate && (
            <div
              className="fixed inset-x-0 bottom-0 z-[100] md:absolute md:inset-auto md:z-50 bg-white border md:rounded-xl shadow-2xl md:shadow-xl mt-1 p-2 flex justify-center md:right-0 md:left-auto">
              <div className="bg-white">
                <DayPicker
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    if (!date) return;
                    if (hasBlockedDateInRange(startDate, date)) {
                      alert('Khoảng ngày chọn dính ngày đã được thuê! Vui lòng chọn lại.');
                      return;
                    }
                    setEndDate(date);
                    setShowEndPicker(false);
                  }}
                  disabled={[
                    { before: startDate },
                    ...disabledDates,
                  ]}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {rentalDays > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Giá thuê ({rentalDays} ngày)</span>
            <span>{rentalFee.toLocaleString('vi-VN')} ₫</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tiền đặt cọc máy (Hoàn trả lại)</span>
            <span>{depositValue.toLocaleString('vi-VN')} ₫</span>
          </div>
          <div className="flex justify-between text-gray-600 border-b pb-2">
            <span>Bảo hiểm thiết bị</span>
            <span>{insurance.toLocaleString('vi-VN')} ₫</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 text-base pt-1">
            <span>Tổng thanh toán tạm tính</span>
            <span className="text-teal-600">{totalAmount.toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>
      )}

      <button
        onClick={handleBooking}
        disabled={!isRentable || rentalDays === 0 || isAdding}
        className={`w-full py-3 rounded-xl font-semibold text-white transition ${
          isRentable && rentalDays > 0
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {isAdding
          ? 'Đang xử lý...'
          : hasSelectedDates
            ? 'Thêm vào giỏ hàng & Xem giỏ'
            : 'Chọn ngày để đặt lịch'}
      </button>
    </div>
  );
}
