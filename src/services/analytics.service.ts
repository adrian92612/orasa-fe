import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";

import type { DashboardStats } from "@/types/analytics";

export const analyticsService = {
  getDashboardStats: async (startDate: string, endDate: string) => {
    const searchParams = new URLSearchParams({
      startDate,
      endDate,
    });

    const response = await apiClient.get<DashboardStats>(
      `${API_ROUTES.ANALYTICS.DASHBOARD}?${searchParams.toString()}`,
    );

    if (!response.data) {
      throw new Error("Failed to fetch dashboard stats");
    }

    return response.data;
  },
};
