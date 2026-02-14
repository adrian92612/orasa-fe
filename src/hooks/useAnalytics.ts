import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics.service";
import type { DashboardStats } from "@/types/analytics";
import { Q_KEYS } from "@/constants/queryKeys";

export const useDashboardStats = (startDate: string, endDate: string) => {
  return useQuery<DashboardStats>({
    queryKey: [Q_KEYS.ANALYTICS, startDate, endDate],
    queryFn: () => analyticsService.getDashboardStats(startDate, endDate),
    // Keep data fresh for 5 minutes as analytics don't change second-by-second
    staleTime: 5 * 60 * 1000,
  });
};

export const useSuspenseDashboardStats = (
  startDate: string,
  endDate: string,
) => {
  return useSuspenseQuery<DashboardStats>({
    queryKey: [Q_KEYS.ANALYTICS, startDate, endDate],
    queryFn: () => analyticsService.getDashboardStats(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
};
