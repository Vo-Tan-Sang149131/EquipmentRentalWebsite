// api.ts
import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type {
  ForgotPasswordRequest,
  JwtResponse,
  LoginRequest,
  MyApiResponse,
  RegisterRequest,
  TokenRefreshResponse,
  ResetPasswordRequest,
  UserResponse,
} from '@/features/auth/types/auth.types.ts';
import type { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/useAuthStore.ts';
import type {
  ChangePasswordRequest,
  RevealKycRequest,
  UserProfileResponse,
} from '@/features/profile/types/profile.type.ts';

/**
 * API CLIENT OVERVIEW
 * ---------------------------------------------------------------------------------
 * This file configures a shared Axios instance for the entire application, featuring:
 * 1. Automatic Access Token attachment to every outgoing request's Authorization header.
 * 2. Automatic unwrapping of the `result` field from Spring Boot backend JSON responses.
 * 3. TOKEN REFRESH QUEUE: When multiple concurrent API requests fail with a 401 error (expired),
 * only the first request triggers the /refresh-token endpoint. Subsequent requests are
 * queued and automatically retried in the background once the new token is acquired.
 * This prevents race conditions.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This ensures cookies are sent with requests
});

/**
 * REQUEST INTERCEPTOR
 * Automatically checks localStorage and attaches the Access Token as a Bearer token if present.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// GLOBAL STATE FOR TOKEN REFRESH FLOW
let isRefreshing = false; // Flag to indicate if a token refresh request is currently in progress
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: any[] = []; // Array to store 401 requests waiting for the new token

/**
 * QUEUE PROCESSOR
 * Iterates through all queued requests, then resolves or rejects them based on the refresh outcome.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token); // Passes the new Access Token to update the request headers
    }
  });
  failedQueue = []; // Clear the queue for future expiration cycles
};

/**
 * RESPONSE INTERCEPTOR
 * Handles data unwrapping for successful responses and intercepts 401 authentication errors.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Automatically unwrap the data bypassing the Spring Boot wrapper if 'result' exists
    return response.data && 'result' in response.data ? response.data.result : response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // LOGIN GUARD: If a 401 error occurs on the login request itself (invalid credentials),
    // reject immediately to show a toast. This avoids infinite refresh loops or unexpected redirects.
    if (
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/refresh-token')
    ) {
      return Promise.reject(error);
    }

    // Prevent infinite retry loops: Only handle 401 once per original request
    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Token is valid or not now will be checked in the backend, so don't do it here

    // QUEUING SCENARIO: Another request is already refreshing the token.
    // Wrap the current request in a Promise and push it to the queue until resolved.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest)); // Retry the request in the background
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          reject: (err: any) => {
            reject(err);
          },
        });
      });
    }

    // PIONEER FLOW: The first request detecting 401 wins the right to refresh the token
    isRefreshing = true;
    try {
      // Enable credential for axios auto attach http cookie only to this endpoint
      const { data } = await axios.post<MyApiResponse<TokenRefreshResponse>>(
        `${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true },
      );

      const { accessToken } = data.result;

      // Update storage with the token from the response:
      localStorage.setItem('token', accessToken);
      isRefreshing = false;

      // Release and retry all queued requests waiting in line
      processQueue(null, accessToken);

      // Self-rescue: Retry the pioneer request with the newly acquired token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Total failure (e.g., Refresh Token expired on server): Cancel all pending requests and force logout
      processQueue(refreshError, null);
      isRefreshing = false;
      useAuthStore.getState().logoutSuccess();
      return Promise.reject(refreshError);
    }
  },
);

// API ENDPOINTS DEFINITION
export const api = {
  auth: {
    login: (data: LoginRequest): Promise<JwtResponse> => apiClient.post('/auth/login', data),

    register: (data: RegisterRequest): Promise<UserResponse> =>
      apiClient.post('/auth/register', data),

    forgotPassword: (data: ForgotPasswordRequest): Promise<void> =>
      apiClient.post('/auth/forgot-password', data),

    resetPassword: (data: ResetPasswordRequest): Promise<void> =>
      apiClient.post('/auth/reset-password', data),

    checkDuplicateEmail: (email: string): Promise<boolean> =>
      apiClient.get('/auth/check-email', { params: { email } }),

    checkDuplicateUsername: (username: string): Promise<boolean> =>
      apiClient.get('/auth/check-username', { params: { username } }),

    googleLoginUrl: 'http://localhost:8080/equipment_rental/oauth2/authorization/google',
    facebookLoginUrl: 'http://localhost:8080/equipment_rental/oauth2/authorization/facebook',
  },
  profile: {
    // API to retrieve all the user profile information
    getMe: (): Promise<UserProfileResponse> => apiClient.get('/users/profile/me'),

    updateBasic: (formData: FormData): Promise<void> =>
      apiClient.put('/users/profile/basic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),

    changePassword: (data: ChangePasswordRequest): Promise<void> =>
      apiClient.put('/users/profile/change-password', data),

    verifyKyc: (formData: FormData): Promise<void> =>
      apiClient.post('/users/profile/verify-kyc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    revealKyc: (data: RevealKycRequest): Promise<string> =>
      apiClient.post('/users/profile/reveal-kyc', data),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getMyOrders: (): Promise<any> => apiClient.get('/orders/my-orders'),
  },
};

export default apiClient;
