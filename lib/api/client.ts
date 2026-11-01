import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/authStore";
import { refreshSession } from "./auth";

/**
 * API Client Configuration
 * Centralized HTTP client for all backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

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
 * Add the signed-in user's access token to every request
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// One refresh at a time: requests that fail together wait for the same refresh.
let refreshing: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) throw new Error("No session to refresh");
  const session = await refreshSession(refreshToken);
  useAuthStore.getState().setAuth(session.user, session.accessToken, session.refreshToken);
  return session.accessToken;
}

function endSession() {
  useAuthStore.getState().logout();
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    const next = encodeURIComponent(window.location.pathname);
    window.location.href = `/login?next=${next}`;
  }
}

/**
 * Response interceptor
 * On a 401, refresh the session once and retry; if that fails, sign out
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;

    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true;
      try {
        refreshing = refreshing ?? refreshAccessToken();
        const token = await refreshing;
        original.headers.set("Authorization", `Bearer ${token}`);
        return apiClient.request(original);
      } catch {
        endSession();
      } finally {
        refreshing = null;
      }
    } else if (error.response?.status === 401) {
      endSession();
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
