interface ProductBase {
  id: number;
  name: string;
  slug: string;
  categoryName: string | null;
  brandName: string | null;
}

export interface Product extends ProductBase {
  primaryImageUrl: string | null;
  minPricePerDay: number;
  status: 'AVAILABLE' | 'OUT_OF_STOCK';
}

export interface SpringPageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Starts from 0
}

export interface ProductInformation extends ProductBase {

  description: string;
  specifications: Specification[];
  includedItems: string[];

}


export type LookupItem = { id: number; name: string };

export interface PriceRange {
  minPrice: number;
  maxPrice: number;
}

export interface ProductImage {

  id: number;
  imageUrl: string;
  isPrimary: boolean;

}

export interface Review {
  id: number;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Owner {

  id: number;
  fullName: string;
  avatarUrl: string | null;
  verified: boolean;

}

export interface DeviceDetail {

  product: ProductInformation;
  device: DeviceInformation;
  owner: Owner;
  reviews: Review[];
  relatedProducts: Product[];

}

export interface DeviceInformation {

  id: number;
  ownerId: number;
  conditionPercent: number;
  availability:
    | 'AVAILABLE'
    | 'RESERVED'
    | 'RENTED'
    | 'MAINTENANCE';

  pricePerDay: number;
  depositValue: number;
  insurance: number;
  images: ProductImage[];
  bookDates: string[];

}


