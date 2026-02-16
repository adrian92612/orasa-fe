import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes"; // Need to check if routes are defined here or need to be added
import type { PageResponse } from "@/types/api"; // Ensure this type is exported from api.ts
import type {
  ActivityLog,
  ActivityLogSearchParams,
} from "@/types/activity-log";

export const activityLogService = {
  getActivityLogsByBusiness: async (
    businessId: string,
    params: ActivityLogSearchParams = {},
  ): Promise<PageResponse<ActivityLog>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", (params.page - 1).toString());
    if (params.size) queryParams.append("size", params.size.toString());

    // Check if we need to search or just list
    const isSearch =
      params.branchId || params.action || params.startDate || params.endDate;

    if (isSearch) {
      if (params.branchId) queryParams.append("branchId", params.branchId);
      if (params.action) queryParams.append("action", params.action);
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);

      const { data } = await apiClient.get<PageResponse<ActivityLog>>(
        `${API_ROUTES.ACTIVITY_LOGS.SEARCH(businessId)}?${queryParams.toString()}`,
      );
      return data!;
    }

    const { data } = await apiClient.get<PageResponse<ActivityLog>>(
      `${API_ROUTES.ACTIVITY_LOGS.BY_BUSINESS(businessId)}?${queryParams.toString()}`,
    );
    return data!;
  },
};
