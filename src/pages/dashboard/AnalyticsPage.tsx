import { Suspense, useState } from "react";
import { startOfMonth, endOfMonth, subMonths, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";

import { useSuspenseDashboardStats } from "@/hooks/useAnalytics";
import {
  DateRangePicker,
  type DatePreset,
} from "@/components/ui/date-range-picker";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import AnalyticsDashboardSkeleton from "@/components/dashboard/AnalyticsDashboardSkeleton";
import { useUser } from "@/context/UserContext";

const AnalyticsDashboardData = ({
  date,
  selectedBranchId,
}: {
  date: DateRange | undefined;
  selectedBranchId?: string | null;
}) => {
  const { data: stats } = useSuspenseDashboardStats(date, selectedBranchId);

  return <AnalyticsDashboard stats={stats} />;
};

const AnalyticsPage = () => {
  const { selectedBranchId } = useUser();

  const now = new Date();
  const presets: DatePreset[] = [
    { label: "Today", date: { from: now, to: now } },
    {
      label: "Yesterday",
      date: { from: subDays(now, 1), to: subDays(now, 1) },
    },
    { label: "Last 7 Days", date: { from: subDays(now, 6), to: now } },
    { label: "Last 30 Days", date: { from: subDays(now, 29), to: now } },
    {
      label: "This Month",
      date: { from: startOfMonth(now), to: endOfMonth(now) },
    },
    {
      label: "Last Month",
      date: {
        from: startOfMonth(subMonths(now, 1)),
        to: endOfMonth(subMonths(now, 1)),
      },
    },
  ];

  const [date, setDate] = useState<DateRange | undefined>(() => {
    const start = new Date();
    start.setDate(now.getDate() - 29);
    return {
      from: start,
      to: now,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-muted-foreground">
          Overview of your business performance.
        </p>
        <div className="flex items-center gap-2">
          <DateRangePicker date={date} setDate={setDate} presets={presets} />
        </div>
      </div>

      <Suspense fallback={<AnalyticsDashboardSkeleton />}>
        <AnalyticsDashboardData
          date={date}
          selectedBranchId={selectedBranchId}
        />
      </Suspense>
    </div>
  );
};

export default AnalyticsPage;
