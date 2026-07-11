// cart.types.ts
export interface CartItemRequest {
  deviceId: number;
  startDate: string;
  endDate: string;
}

export interface CartDeviceDTO {
  id: number;
  name: string;
  primaryImageUrl: string;
  ownerName: string;
  pricePerDay: number;
  depositValue: number;
}

export interface CartItemResponse {
  cartItemId: number;
  startDate: string;
  endDate: string;
  rentalDays: number;
  subTotalRentalFee: number;
  device: CartDeviceDTO;
}

export interface CartResponse {
  items: CartItemResponse[];
  totalRentalFeeAll: number;
  totalDepositAll: number;
  grandTotal: number;
}
