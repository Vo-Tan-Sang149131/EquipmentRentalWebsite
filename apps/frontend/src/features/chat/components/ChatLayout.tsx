import RoomList from './RoomList';
import ChatWindow from './ChatWindow';
import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';

export default function ChatLayout() {
  const disconnectWebSocket = useChatStore((state) => state.disconnectWebSocket);

  // Automatically disconnect WebSocket when user leaves the page
  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, [disconnectWebSocket]);

  return (
    <div className="flex rounded-xl border border-border overflow-hidden h-[calc(100vh-140px)] max-h-175 shadow-sm">
      <RoomList />
      <ChatWindow />
    </div>
  );
}
