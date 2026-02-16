import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { activityLogService } from "@/services/activity-log.service";
import type { ActivityLogSearchParams } from "@/types/activity-log";
import { useUser } from "@/context/UserContext";
import { Q_KEYS } from "@/constants/queryKeys";

export const useActivityLogs = (params: ActivityLogSearchParams = {}) => {
  const { user } = useUser();
  const businessId = user?.businessId;

  return useQuery({
    queryKey: [Q_KEYS.ACTIVITY_LOGS, businessId, params],
    queryFn: async () => {
      if (!businessId) throw new Error("No business ID");
      return activityLogService.getActivityLogsByBusiness(businessId, params);
    },
    enabled: !!businessId,
  });
};

export const useSuspenseActivityLogs = (
  params: ActivityLogSearchParams = {},
) => {
  const { user } = useUser();
  const businessId = user?.businessId;

  return useSuspenseQuery({
    queryKey: [Q_KEYS.ACTIVITY_LOGS, businessId, params],
    queryFn: async () => {
      if (!businessId) throw new Error("No business ID");
      return activityLogService.getActivityLogsByBusiness(businessId, params);
    },
    // Activity logs are immutable, cache for 1 minute
    staleTime: 60 * 1000,
  });
};
