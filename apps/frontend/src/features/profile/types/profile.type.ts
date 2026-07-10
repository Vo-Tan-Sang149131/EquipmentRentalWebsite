// profile.type.ts

export interface ProfileInfo {
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  dob: string | null;
  address: string | null;
  bio: string | null;
}

export interface AddressInfo {
  id: number;
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  isDefault: boolean;
}

export interface UserProfileResponse {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  roles: string[];
  trustScore: number;

  profile: ProfileInfo | null;
  addresses: AddressInfo[];

  kycCardNumber: string | null;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_STARTED';
  kycVerifiedAt: string | null;
}

export interface BasicProfileRequest {
  phoneNumber: string | null;
  avatarFile: File | null;

  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  dob: string | null;
  address: string | null;
  bio: string | null;
}

export interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword: string;
}

export interface KycVerificationRequest {
  kycCardNumber: string;
  kycCardFrontFile: File | null;
  kycCardBackFile: File | null;
}

export interface RevealKycRequest {
  password: string;
}
