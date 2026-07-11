// @/features/chat/pages/MessagePage.tsx
import { useEffect, useState } from 'react'; // Thêm useState
import { useSearchParams, Link } from 'react-router-dom';
import { useChatStore } from '../store/useChatStore';
import ChatLayout from '@/features/chat/components/ChatLayout.tsx';
import { MessageSquareOff } from 'lucide-react';

export function MessagePage() {
  const [searchParams] = useSearchParams();
  const { selectRoom, rooms, fetchRooms } = useChatStore();
  const roomIdFromUrl = searchParams.get('room');

  // Thêm một state để biết khi nào trang đã tải xong danh sách phòng lần đầu
  const [isFirstLoadDone, setIsFirstLoadDone] = useState(false);

  useEffect(() => {
    // Đợi fetchRooms chạy xong xuôi rồi mới tắt trạng thái loading ban đầu
    fetchRooms().finally(() => {
      setIsFirstLoadDone(true);
    });
  }, [fetchRooms]);

  useEffect(() => {
    if (roomIdFromUrl) {
      const roomId = Number(roomIdFromUrl);
      if (!isNaN(roomId)) {
        selectRoom(roomId);
      }
    }
  }, [roomIdFromUrl, selectRoom]);

  if (!isFirstLoadDone) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center text-sm text-muted-foreground">
        Đang tải danh sách cuộc trò chuyện...
      </div>
    );
  }

  if (rooms.length === 0 && !roomIdFromUrl) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-gray-100 rounded-full text-gray-400 mb-4">
          <MessageSquareOff className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có cuộc trò chuyện nào</h3>
        <p className="text-gray-500 max-w-sm mb-6">
          Bạn có thể liên hệ với các chủ máy thông qua nút "Nhắn tin với chủ máy" tại trang chi tiết sản phẩm.
        </p>
        <Link to="/products"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition">
          Khám phá sản phẩm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1920px] mx-auto p-4 lg:p-8">
      <ChatLayout />
    </div>
  );
}
