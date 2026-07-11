export interface DeviceImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface DeviceForEdit {
  id: number;
  productId: number;
  productName: string;
  serialNumber: string;
  conditionPercent: number;
  pricePerDay: number;
  depositValue: number;
  status: string;
  images: DeviceImage[];
}

export interface DeviceUpdatePayload {
  pricePerDay: number;
  depositValue: number;
}

export interface DeviceManage {
  id: number;
  productId: number;
  productName: string;
  serialNumber: string;
  conditionPercent: number;
  pricePerDay: number;
  depositValue: number;
  status: string;
  images: Array<{ imageUrl: string; imageType: string }>;
}


export interface Order {
  orderId: number;
  status: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  renterUsername: string;
  renterPhone?: string;
  renterEmail?: string;
  deviceNames: string[];
}

export interface Review {
  id: number;
  renterUsername: string;
  rating: number;
  comment: string;
  createdAt: string;
  deviceName?: string;
}

export interface OwnerStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  activeRentals: number;
  totalRevenue: number;
}
