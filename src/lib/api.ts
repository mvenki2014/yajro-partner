import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "@/lib/storage";

const BASE_URL = (import.meta as any).env.VITE_API_URL || "http://localhost:3000/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Refresh logic variables
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Global logout function to be used by interceptors
export const logoutUser = () => {
  tokenStorage.clearTokens();
  // We'll rely on useAuth to pick up the changes via the event or manual call
  // For a more immediate effect, we can clear the QueryClient if we had a reference
};

// Request Interceptor: Add Authorization token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh and Errors
apiClient.interceptors.response.use(
  (response) => {
    // Minimize mapping overhead if structure is already correct
    if (response.data?.data && response.data?.message === undefined && response.data?.data?.message) {
       response.data.message = response.data.data.message;
       return response;
    }
    
    // Fallback to existing standardization if needed
    const standardizedResponse = {
      ...response,
      data: {
        data: response.data?.data,
        message: response.data?.data?.message || response.data?.message,
      },
    };
    return standardizedResponse;
  },
  async (error: AxiosError<any>) => {
    const originalRequest: any = error.config;

    // Handle 401 Unauthorized (Token Expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();
      const accessToken = tokenStorage.getAccessToken();

      if (refreshToken && originalRequest.url !== "/auth/refresh") {
        try {
          // Note: Use fresh axios instance to avoid infinite loop with interceptor
          const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, 
            { refreshToken },
            { 
              headers: { 
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json" 
              } 
            }
          );

          if (refreshResponse.status === 200 || refreshResponse.status === 201) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

            // Session Invalidation Guard: Check if user logged out while waiting for refresh
            // If the refresh token was cleared from storage during the async call, abort.
            if (!tokenStorage.getRefreshToken()) {
              const sessionError = new Error("Session invalidated during refresh");
              processQueue(sessionError, null);
              return Promise.reject(sessionError);
            }

            tokenStorage.setTokens(newAccessToken, newRefreshToken);
            
            apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            processQueue(null, newAccessToken);
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          logoutUser();
          console.error("Token refresh failed", refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        isRefreshing = false;
        logoutUser();
      }
    }

    // Standardize error message extraction
    const errorMessage = error.response?.data?.data?.message || error.response?.data?.message || error.message || "Request failed";
    return Promise.reject(new Error(errorMessage));
  }
);

/**
 * Registry of all API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER_INITIATE: "/register/initiate",
    REGISTER_VERIFY: "/register/verify-otp",
    REGISTER_RESEND: "/register/resend-otp",
    REQUEST_OTP: "/auth/request-otp",
    VERIFY_OTP: "/auth/verify-otp",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
  POOJARIS: {
    UPDATE_PROFILE: "/poojaris/profile",
  }
};

/**
 * Poojari Auth APIs using axios client
 */
export const authApi = {
  // Registration
  registerInitiate: (data: {
    mobileNumber: string;
    fullName: string;
    email: string;
    experienceYears: number;
    serviceLocation: string;
    languagesKnown: string[];
  }) => apiClient.post(API_ENDPOINTS.AUTH.REGISTER_INITIATE, data).then(res => res.data),

  registerVerifyOtp: (data: { mobileNumber: string; otp: string }) =>
    apiClient.post(API_ENDPOINTS.AUTH.REGISTER_VERIFY, data).then(res => res.data),

  registerResendOtp: (data: { mobileNumber: string }) =>
    apiClient.post(API_ENDPOINTS.AUTH.REGISTER_RESEND, data).then(res => res.data),

  // Login
  requestOtp: (mobileNumber: string) =>
    apiClient.post(API_ENDPOINTS.AUTH.REQUEST_OTP, { mobileNumber }).then(res => res.data),

  verifyOtp: (mobileNumber: string, otp: string) =>
    apiClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { mobileNumber, otp }).then(res => res.data),

  // Profile
  getMe: () => apiClient.get(API_ENDPOINTS.AUTH.ME).then(res => res.data),

  updateProfile: (data: {
    name?: string;
    experienceYears?: number;
    serviceLocation?: string;
    languagesKnown?: string[];
    specialties?: string[];
  }) => apiClient.patch(API_ENDPOINTS.POOJARIS.UPDATE_PROFILE, data).then(res => res.data),

  logout: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT).then(res => res.data),
};

export type Slot = {
  id: string;
  label: string;
  sub: string;
};

export const fetchTimeSlots = async (): Promise<Slot[]> => {
  // In a real app, this would be an API call
  // return apiClient.get('/time-slots').then(res => res.data.data);
  
  // Updating to 24-hour pattern as per requirements: 0-4, 4-8, 8-12, 12-16, 16-20, 20-24
  return [
    { id: "00-04", label: "00 - 04", sub: "Early Morning" },
    { id: "04-08", label: "04 - 08", sub: "Dawn" },
    { id: "08-12", label: "08 - 12", sub: "Morning" },
    { id: "12-16", label: "12 - 16", sub: "Afternoon" },
    { id: "16-20", label: "16 - 20", sub: "Evening" },
    { id: "20-24", label: "20 - 24", sub: "Night" },
  ];
};

export default apiClient;
