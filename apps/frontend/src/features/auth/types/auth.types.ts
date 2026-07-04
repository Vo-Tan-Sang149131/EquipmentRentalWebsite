// auth.types.ts
// Interface for API requests

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phoneNumber: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  captchaToken?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Interface for API responses

export interface MyApiResponse<T> {
  statusCode: number;
  appCode?: number;
  message: string;
  result: T;
  timestamp: string;
}

export interface UserResponse {
  username: string;
  email: string;
  roles: string[];
}

export interface JwtResponse {
  token: string;
  type: string;
  expiresIn: number;
  username: string;
  roles: string[];
}

export interface TokenRefreshResponse {
  accessToken: string;
}
