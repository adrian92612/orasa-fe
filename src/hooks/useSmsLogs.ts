import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, PageResponse } from "@/types/api";
import type { SmsLog, SmsLogSearchParams } from "@/types/sms";

export const useSmsLogs = (params: SmsLogSearchParams = {}) => {
  return useQuery({
    queryKey: ["sms-logs", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", (params.page - 1).toString());
      if (params.size) queryParams.append("size", params.size.toString());

      const { data } = await apiClient.get<ApiResponse<PageResponse<SmsLog>>>(
        `/sms/logs?${queryParams.toString()}`,
      );
      return data.data;
    },
  });
};
