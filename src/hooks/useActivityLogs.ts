import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api-client";
import { ApiResponse, PageResponse } from "@/types/api";
import { ActivityLog, ActivityLogSearchParams } from "@/types/activity-log";
import { useAuth } from "@/context/AuthContext";

export const useActivityLogs = (params: ActivityLogSearchParams = {}) => {
  const { user } = useAuth();
  const businessId = user?.businessId;

  return useQuery({
    queryKey: ["activity-logs", businessId, params],
    queryFn: async () => {
      if (!businessId) throw new Error("No business ID");

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", (params.page - 1).toString());
      if (params.size) queryParams.append("size", params.size.toString());
      if (params.branchId) queryParams.append("branchId", params.branchId);
      if (params.action) queryParams.append("action", params.action);
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);

      // Use search endpoint if any filter is applied, otherwise use list endpoint
      const isSearch =
        params.branchId || params.action || params.startDate || params.endDate;
      const endpoint = isSearch
        ? `/activity-logs/business/${businessId}/search?${queryParams.toString()}`
        : `/activity-logs/business/${businessId}?${queryParams.toString()}`;

      const { data } =
        await apiClient.get<ApiResponse<PageResponse<ActivityLog>>>(endpoint);
      return data.data;
    },
    enabled: !!businessId,
  });
};
