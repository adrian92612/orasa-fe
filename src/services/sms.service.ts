import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";
import type { PageResponse } from "@/types/api";
import type { SmsLog, SmsLogSearchParams } from "@/types/sms";

export const smsService = {
  getSmsLogs: async (
    params: SmsLogSearchParams = {},
  ): Promise<PageResponse<SmsLog>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", (params.page - 1).toString());
    if (params.size) queryParams.append("size", params.size.toString());
    if (params.branchId) queryParams.append("branchId", params.branchId);
    if (params.status) queryParams.append("status", params.status);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    const { data } = await apiClient.get<PageResponse<SmsLog>>(
      `${API_ROUTES.SMS_LOGS.BASE}?${queryParams.toString()}`,
    );
    return data!;
  },
};
