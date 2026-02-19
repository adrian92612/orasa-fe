import { apiClient, type ApiResponse } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";
import type { PageResponse } from "@/types/api";
import type {
  SmsLog,
  SmsLogSearchParams,
  ReminderConfigResponse,
  CreateReminderConfigRequest,
  UpdateReminderConfigRequest,
} from "@/types/sms";

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

  getReminderConfigs: async (): Promise<ReminderConfigResponse[]> => {
    const response = await apiClient.get<ReminderConfigResponse[]>(
      API_ROUTES.REMINDER_CONFIGS.BASE,
    );
    return response.data || [];
  },

  createReminderConfig: async (
    payload: CreateReminderConfigRequest,
  ): Promise<ApiResponse<ReminderConfigResponse>> => {
    return await apiClient.post<ReminderConfigResponse>(
      API_ROUTES.REMINDER_CONFIGS.BASE,
      payload,
    );
  },

  updateReminderConfig: async (
    id: string,
    payload: UpdateReminderConfigRequest,
  ): Promise<ApiResponse<ReminderConfigResponse>> => {
    return await apiClient.put<ReminderConfigResponse>(
      API_ROUTES.REMINDER_CONFIGS.BY_ID(id),
      payload,
    );
  },

  deleteReminderConfig: async (id: string): Promise<ApiResponse<void>> => {
    return await apiClient.delete<void>(API_ROUTES.REMINDER_CONFIGS.BY_ID(id));
  },
};
