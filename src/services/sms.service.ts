import { apiClient, type ApiResponse } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";

import type {
  CreateReminderConfigRequest,
  ReminderConfigResponse,
  UpdateReminderConfigRequest,
} from "@/types/sms";

export const smsService = {
  getReminderConfigs: async (): Promise<ReminderConfigResponse[]> => {
    const response = await apiClient.get<ReminderConfigResponse[]>(
      API_ROUTES.REMINDER_CONFIGS.BASE,
    );
    return response.data || [];
  },

  createReminderConfig: async (
    data: CreateReminderConfigRequest,
  ): Promise<ApiResponse<ReminderConfigResponse>> => {
    const response = await apiClient.post<ReminderConfigResponse>(
      API_ROUTES.REMINDER_CONFIGS.BASE,
      data,
    );
    return response;
  },

  updateReminderConfig: async (
    id: string,
    data: UpdateReminderConfigRequest,
  ): Promise<ApiResponse<ReminderConfigResponse>> => {
    const response = await apiClient.put<ReminderConfigResponse>(
      API_ROUTES.REMINDER_CONFIGS.BY_ID(id),
      data,
    );
    return response;
  },

  deleteReminderConfig: async (id: string): Promise<ApiResponse<void>> => {
    return await apiClient.delete<void>(API_ROUTES.REMINDER_CONFIGS.BY_ID(id));
  },
};
