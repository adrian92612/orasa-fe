type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

const apiClient = {
  post: async <T, B = unknown>(
    url: string,
    body: B,
  ): Promise<ApiResponse<T>> => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const result = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !result.success) {
      throw new Error(result.message || "An error occurred");
    }

    return result;
  },

  put: async <T, B = unknown>(
    url: string,
    body: B,
  ): Promise<ApiResponse<T>> => {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const result = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !result.success) {
      throw new Error(result.message || "An error occurred");
    }

    return result;
  },

  patch: async <T, B = unknown>(
    url: string,
    body: B,
  ): Promise<ApiResponse<T>> => {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const result = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !result.success) {
      throw new Error(result.message || "An error occurred");
    }

    return result;
  },

  get: async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !result.success) {
      throw new Error(result.message || "An error occurred");
    }

    return result;
  },

  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !result.success) {
      throw new Error(result.message || "An error occurred");
    }

    return result;
  },
};

export { apiClient };
export type { ApiResponse };
