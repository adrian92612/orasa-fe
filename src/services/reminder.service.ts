import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";
import type { ReminderConfigResponse } from "@/types/sms";

export const reminderService = {
  getConfigs: async (_businessId: string) => {
    const { data } = await apiClient.get<ReminderConfigResponse[]>(
      API_ROUTES.REMINDER_CONFIGS.BASE,
    );
    return data;
  },
};
