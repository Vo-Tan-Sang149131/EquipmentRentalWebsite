import apiClient from '@/services/api.ts';
import type { SpringPageResponse } from '@/features/product/types/product.types.ts';
import type {
  DeviceForEdit,
  DeviceManage,
  DeviceUpdatePayload,
  Order,
  Review,
  OwnerStats,
} from '../types/device.types.ts';

export const deviceService = {
  // Get owner's device inventory
  getMyInventory: (page = 0, size = 8): Promise<SpringPageResponse<DeviceManage>> =>
    apiClient.get(`/devices/my-inventory?page=${page}&size=${size}`),

  // Get device detail for edit (owner only)
  getDeviceForEdit: (deviceId: number): Promise<DeviceForEdit> =>
    apiClient.get(`/devices/${deviceId}/edit`),

  // Update device (owner only)
  updateDevice: (deviceId: number, data: DeviceUpdatePayload): Promise<void> =>
    apiClient.put(`/devices/${deviceId}`, data),

  // Set device image as primary (owner only)
  setImageAsPrimary: (deviceId: number, imageId: number): Promise<void> =>
    apiClient.put(`/devices/${deviceId}/images/${imageId}/primary`),

  // Delete device image (owner only)
  deleteDeviceImage: (deviceId: number, imageId: number): Promise<void> =>
    apiClient.delete(`/devices/${deviceId}/images/${imageId}`),

  // Add device image (owner only)
  addDeviceImage: (deviceId: number, imageUrl: string): Promise<void> =>
    apiClient.post(`/devices/${deviceId}/images`, imageUrl, {
      headers: { 'Content-Type': 'text/plain' },
    }),

  // Orders
  getOwnerOrders: (page = 0, size = 10): Promise<SpringPageResponse<Order>> =>
    apiClient.get(`/orders/owner?page=${page}&size=${size}`),
  confirmOrder: (orderId: number): Promise<Order> => apiClient.post(`/orders/${orderId}/owner/confirm`, {}),
  rejectOrder: (orderId: number): Promise<Order> => apiClient.post(`/orders/${orderId}/owner/reject`, {}),
  reportIssue: (orderId: number, title: string, description: string): Promise<void> =>
    apiClient.post(`/issues?orderId=${orderId}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`),

  // Reviews
  getOwnerReviews: (page = 0, size = 10): Promise<SpringPageResponse<Review>> =>
    apiClient.get(`/products/reviews/my?page=${page}&size=${size}`),

  // Calendar
  getBlockedDates: (deviceId: number): Promise<string[]> =>
    apiClient.get(`/devices/${deviceId}/calendar/future`),
  blockDates: (deviceId: number, startDate: string, endDate: string): Promise<void> =>
    apiClient.post(`/devices/${deviceId}/calendar/block`, { startDate, endDate }),
  unblockDates: (deviceId: number, startDate: string, endDate: string): Promise<void> =>
    apiClient.delete(`/devices/${deviceId}/calendar/unblock?start=${startDate}&end=${endDate}`),

  // Dashboard
  getOwnerStats: (): Promise<OwnerStats> => apiClient.get('/orders/owner/overview'),
};

