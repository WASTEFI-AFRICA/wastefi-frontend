import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

/**
 * API Client Configuration
 * Centralized HTTP client for all backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Create axios instance with default config
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds (important for low-bandwidth environments)
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * Add authentication token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (will be set by auth flow)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handle common error cases
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle unauthorized access
    if (error.response?.status === 401) {
      // Clear auth token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Generic request wrapper with error handling
 */
export async function apiRequest<T>(
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new APIError(
        error.response?.data?.message || error.message,
        error.response?.status || 500,
        error.response?.data
      );
    }
    throw error;
  }
}

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: "GET", url }),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: "POST", url, data }),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: "PUT", url, data }),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: "PATCH", url, data }),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: "DELETE", url }),
};

export default apiClient;
