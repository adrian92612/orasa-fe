import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { analyticsService } from "@/services/analytics.service";
import { Q_KEYS } from "@/constants/queryKeys";

const formatDateRange = (date: DateRange | undefined) => {
  const startDateStr = date?.from ? format(date.from, "yyyy-MM-dd") : "";
  const endDateStr = date?.to
    ? format(date.to, "yyyy-MM-dd")
    : date?.from
      ? format(date.from, "yyyy-MM-dd")
      : "";

  return { startDateStr, endDateStr };
};

export const useSuspenseDashboardStats = (
  date: DateRange | undefined,
  branchId?: string | null,
) => {
  const { startDateStr, endDateStr } = formatDateRange(date);

  return useSuspenseQuery({
    queryKey: [Q_KEYS.ANALYTICS, startDateStr, endDateStr, branchId],
    queryFn: () =>
      analyticsService.getDashboardStats(startDateStr, endDateStr, branchId),
    staleTime: 5 * 60 * 1000,
  });
};
