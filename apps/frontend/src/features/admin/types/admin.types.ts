export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
}

export interface User {
  userId: number;
  username: string;
  email: string;
  role: string;
  active: boolean;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  kycStatus?: string;
}

export interface IssueReport {
  id: number;
  orderId: number;
  title: string;
  description: string;
  status: string;
  reporterUsername: string;
  createdAt?: string;
  reportedBy?: string;
}

export interface AdminOrder {
  orderId: number;
  status: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  renterUsername: string;
  renterPhone?: string;
  renterEmail?: string;
  ownerUsername?: string;
  deviceNames?: string[];
}

export interface Payment {
  id: number;
  orderId?: number;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  paymentToken?: string;
  createdAt: string;
}

export interface AdminDevice {
  id: number;
  productName: string;
  serialNumber: string;
  pricePerDay: number;
  depositValue: number;
  status: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalOwners: number;
  totalRenters: number;
  activeUsers: number;
  totalDevices: number;
  totalOrders: number;
  totalRevenue: number;
}
