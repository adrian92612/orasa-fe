import { API_ROUTES } from "@/constants/routes";
import type { ApiResponse } from "@/types/api";

let isRefreshing = false;
let refreshSubscribers: ((error?: Error) => void)[] = [];

const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

const onRefreshFailed = (error: Error) => {
  refreshSubscribers.forEach((cb) => cb(error));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb: (error?: Error) => void) => {
  refreshSubscribers.push(cb);
};

const request = async <T, B = unknown>(url: string, options: RequestInit): Promise<ApiResponse<T>> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  // Handle 401 Unauthorized
  const isRefreshExcluded =
    url.includes("/auth/refresh") ||
    url.includes("/auth/staff/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/forgot-password") ||
    url.includes("/auth/reset-password");

  if (response.status === 401 && !isRefreshExcluded) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(API_ROUTES.AUTH.REFRESH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (refreshResponse.ok) {
          isRefreshing = false;
          onRefreshed();
          return request<T, B>(url, options);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (error) {
        onRefreshFailed(error instanceof Error ? error : new Error("Refresh failed"));
        // Don't redirect here, let the caller handle it (e.g. RouteGuard or UserContext)
        throw new Error("Session expired");
      } finally {
        isRefreshing = false;
      }
    }

    // If already refreshing, wait for it to finish and then retry or fail
    return new Promise((resolve, reject) => {
      addRefreshSubscriber((error) => {
        if (error) {
          reject(error);
        } else {
          resolve(request<T, B>(url, options));
        }
      });
    });
  }

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "An error occurred");
  }

  return result;
};

const apiClient = {
  post: async <T, B = unknown>(url: string, body: B): Promise<ApiResponse<T>> => {
    return request<T, B>(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put: async <T, B = unknown>(url: string, body: B): Promise<ApiResponse<T>> => {
    return request<T, B>(url, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  patch: async <T, B = unknown>(url: string, body: B): Promise<ApiResponse<T>> => {
    return request<T, B>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  get: async <T>(url: string): Promise<ApiResponse<T>> => {
    return request<T>(url, {
      method: "GET",
    });
  },

  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    return request<T>(url, {
      method: "DELETE",
    });
  },
};

export { apiClient };
export type { ApiResponse };
