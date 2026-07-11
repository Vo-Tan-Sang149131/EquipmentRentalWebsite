import apiClient from '@/services/api.ts';
import type {
  Brand,
  Category,
  User,
  AdminOrder,
  Payment,
  IssueReport,
  DashboardStats,
  AdminDevice,
} from '../types/admin.types';
import type { LookupItem } from '@/features/product/types/product.types.ts';

export const adminService = {
  // Brands
  getBrands: () => apiClient.get<LookupItem[]>('/lookups/brands'),
  saveBrand: (brand: Partial<Brand>) =>
    brand.id ? apiClient.put(`/brands/${brand.id}`, brand) : apiClient.post('/brands', brand),
  deleteBrand: (id: number) => apiClient.delete(`/brands/${id}`),

  // Categories
  getCategories: () => apiClient.get<LookupItem[]>('/lookups/categories'),
  saveCategory: (category: Partial<Category>) =>
    category.id ? apiClient.put(`/categories/${category.id}`, category) : apiClient.post('/categories', category),
  deleteCategory: (id: number) => apiClient.delete(`/categories/${id}`),

  // Users
  getUsers: () => apiClient.get<User[]>('/admin/users'),
  toggleUserStatus: (userId: number) => apiClient.put(`/admin/users/${userId}/toggle-enabled`, {}),
  getUserDetail: (userId: number) => apiClient.get<User>(`/admin/users/${userId}`),
  updateUserRoles: (userId: number, roles: string[]) => apiClient.put(`/admin/users/${userId}/roles`, roles),

  // Orders
  getOrders: () => apiClient.get<AdminOrder[]>('/admin/orders'),
  cancelOrder: (orderId: number) => apiClient.post(`/admin/orders/${orderId}/cancel`, {}),

  // Payments
  getPayments: () => apiClient.get<Payment[]>('/admin/payments'),

  // Issues
  getIssues: () => apiClient.get<IssueReport[]>('/issues'),
  updateIssueStatus: (issueId: number, status: string) =>
    apiClient.put(`/issues/${issueId}/status?status=${status}`),

  // Devices
  getPendingDevices: () => apiClient.get<AdminDevice[]>('/devices/pending'),
  approveDevice: (id: number) => apiClient.put(`/devices/${id}/approve`, {}),

  // Dashboard
  getStats: () => apiClient.get<DashboardStats>('/admin/overview'),
};
