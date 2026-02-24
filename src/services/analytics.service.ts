import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";

import type { DashboardStats } from "@/types/analytics";

export const analyticsService = {
  getDashboardStats: async (
    startDate: string,
    endDate: string,
    branchId?: string | null,
  ): Promise<DashboardStats> => {
    const searchParams = new URLSearchParams({
      startDate,
      endDate,
    });

    if (branchId) {
      searchParams.append("branchId", branchId);
    }

    const response = await apiClient.get<DashboardStats>(
      `${API_ROUTES.ANALYTICS.DASHBOARD}?${searchParams.toString()}`,
    );
    return response.data!;
  },
};
