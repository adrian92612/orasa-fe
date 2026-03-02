import { useQuery } from "@tanstack/react-query";
import { reminderService } from "@/services/reminder.service";
import { Q_KEYS } from "@/constants/queryKeys";

export const useReminders = (businessId?: string | null) => {
  return useQuery({
    queryKey: [Q_KEYS.REMINDER_CONFIGS, businessId],
    queryFn: () => {
      if (!businessId) return Promise.resolve([]);
      return reminderService.getConfigs();
    },
    enabled: !!businessId,
  });
};
