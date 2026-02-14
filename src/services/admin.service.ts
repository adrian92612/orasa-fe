import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";
import type { Page } from "@/types/common";
import type { BusinessResponse } from "@/types/business";

export const adminService = {
  getAllBusinesses: async (params: {
    query?: string;
    status?: string;
    page?: number;
    size?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append("query", params.query);
    if (params.status && params.status !== "ALL")
      searchParams.append("status", params.status);
    if (params.page !== undefined)
      searchParams.append("page", params.page.toString());
    if (params.size !== undefined)
      searchParams.append("size", params.size.toString());

    return await apiClient.get<Page<BusinessResponse>>(
      `${API_ROUTES.ADMIN.BUSINESSES}?${searchParams.toString()}`,
    );
  },

  activateSubscription: async (businessId: string) => {
    return await apiClient.post<void>(
      API_ROUTES.ADMIN.ACTIVATE_SUBSCRIPTION(businessId),
      {},
    );
  },

  extendSubscription: async (businessId: string, months: number) => {
    return await apiClient.post<void>(
      API_ROUTES.ADMIN.EXTEND_SUBSCRIPTION(businessId),
      { months },
    );
  },

  cancelSubscription: async (businessId: string) => {
    return await apiClient.post<void>(
      API_ROUTES.ADMIN.CANCEL_SUBSCRIPTION(businessId),
      {},
    );
  },

  addCredits: async (businessId: string, credits: number) => {
    return await apiClient.post<void>(
      API_ROUTES.ADMIN.ADD_CREDITS(businessId),
      {
        credits,
      },
    );
  },

  seedDemoData: async () => {
    return await apiClient.post<void>(API_ROUTES.ADMIN.SEED_DEMO, {});
  },
};
