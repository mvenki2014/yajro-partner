import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "@/lib/storage";
import { EncryptionService } from "./encryption";

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
    // The API nests the actual payload inside a 'data' property.
    // We standardize it here to simplify consumer logic (e.g., in useQuery).
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      const standardizedResponse = {
        ...response,
        data: {
          ...response.data.data, // Hoist the nested data
          message: response.data.message || response.data.data?.message,
        },
      };
      return standardizedResponse;
    }
    return response;
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

      const authEndpoints = [
        API_ENDPOINTS.AUTH.VERIFY_OTP,
        API_ENDPOINTS.AUTH.REQUEST_OTP,
        API_ENDPOINTS.AUTH.REGISTER_VERIFY,
        API_ENDPOINTS.AUTH.REGISTER_INITIATE,
        API_ENDPOINTS.AUTH.REGISTER_RESEND,
      ];

      const isAuthEndpoint = authEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));

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
        // Only logout if it's NOT an auth endpoint, otherwise it's just a failed login attempt
        if (!isAuthEndpoint) {
          logoutUser();
        }
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
  },
  POOJA_SERVICES: {
    LIST: "/pooja-services",
    CREATE: "/pooja-services",
    UPDATE_STATUS: (id: string) => `/pooja-services/${id}/status`,
  },
  KYC: {
    GET: "/poojaris/kyc",
    SUBMIT: "/kyc",
    UPDATE: "/kyc",
    AADHAAR: "/poojaris/kyc/aadhaar",
    PAN: "/poojaris/kyc/pan",
    BANK: "/poojaris/kyc/bank",
    REVIEW: "/poojaris/kyc/review",
  },
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

export type PoojaServicePackagePayload = {
  name: "Basic" | "Standard" | "Premium";
  price: number;
  description: string;
};

export type PoojaServicePayload = {
  name: string;
  category: string;
  description: string;
  duration: string;
  basePrice?: number;
  customPrice: boolean;
  visitType: "Home Visit" | "Temple Visit" | "Both";
  requiredItems?: string[];
  enabled: boolean;
  image?: string;
  packages?: PoojaServicePackagePayload[];
};

export const poojaServicesApi = {
  list: () => apiClient.get(API_ENDPOINTS.POOJA_SERVICES.LIST).then((res) => res.data),
  create: (data: PoojaServicePayload) =>
    apiClient.post(API_ENDPOINTS.POOJA_SERVICES.CREATE, data).then((res) => res.data),
  updateStatus: (serviceId: string, data: { enabled: boolean }) =>
    apiClient.patch(API_ENDPOINTS.POOJA_SERVICES.UPDATE_STATUS(serviceId), data).then((res) => res.data),
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

export type KycStatus = "NOT_SUBMITTED" | "PENDING" | "REVIEW" | "IN_REVIEW" | "APPROVED" | "REJECTED";

export type KycPayload = {
  aadhaarNumber: string;
  aadhaarFront: string;
  aadhaarBack: string;
  panNumber: string;
  panDocument: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
};

export type KycData = {
  kycStatus: KycStatus;
  aadharNumber?: string;
  panNumber?: string;
  accountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  accountHolderName?: string;
  aadharFPath?: string;
  aadharBPath?: string;
  panPath?: string;
  bankDocPath?: string;
  rejectionReason?: string;
  kycCompletedDate?: string;
  kycExpireDate?: string;
};

export const kycApi = {
  get: (): Promise<KycData | null> =>
    apiClient
      .get(API_ENDPOINTS.KYC.GET)
      .then((res) => {
        const kyc = res.data;
        if (!kyc) return null;

        // Decode base64 values from API as requested
        return {
          ...kyc,
          aadharNumber: kyc.aadharNumber ? EncryptionService.base64Decode(kyc.aadharNumber) : null,
          panNumber: kyc.panNumber ? EncryptionService.base64Decode(kyc.panNumber) : null,
          accountNumber: kyc.accountNumber ? EncryptionService.base64Decode(kyc.accountNumber) : null,
          aadharFPath: kyc.aadharFPath ? EncryptionService.base64Decode(kyc.aadharFPath) : kyc.aadharFPath,
          aadharBPath: kyc.aadharBPath ? EncryptionService.base64Decode(kyc.aadharBPath) : kyc.aadharBPath,
          panPath: kyc.panPath ? EncryptionService.base64Decode(kyc.panPath) : kyc.panPath,
          bankDocPath: kyc.bankDocPath ? EncryptionService.base64Decode(kyc.bankDocPath) : kyc.bankDocPath,
        };
      })
      .catch(() => null),

  submit: (data: KycPayload): Promise<KycData> =>
    apiClient.post(API_ENDPOINTS.KYC.SUBMIT, data).then((res) => res.data),

  update: (data: Partial<KycPayload>): Promise<KycData> =>
    apiClient.put(API_ENDPOINTS.KYC.UPDATE, data).then((res) => res.data),

  submitStep: (step: "aadhaar" | "pan" | "bank" | "review", formData: FormData): Promise<any> => {
    const endpoints = {
      aadhaar: API_ENDPOINTS.KYC.AADHAAR,
      pan: API_ENDPOINTS.KYC.PAN,
      bank: API_ENDPOINTS.KYC.BANK,
      review: API_ENDPOINTS.KYC.REVIEW,
    };
    return apiClient
      .post(endpoints[step], formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },
};
