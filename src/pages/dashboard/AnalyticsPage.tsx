import { Suspense, useState } from "react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { useSuspenseDashboardStats } from "@/hooks/useAnalytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import AnalyticsDashboardSkeleton from "@/components/dashboard/AnalyticsDashboardSkeleton";

const AnalyticsPageContent = () => {
  const [dateRange, setDateRange] = useState("last30Days");

  const getDateRange = () => {
    const now = new Date();
    if (dateRange === "lastMonth") {
      const lastMonth = subMonths(now, 1);
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
      };
    }
    if (dateRange === "last7Days") {
      // Last 7 days including today
      const start = new Date();
      start.setDate(now.getDate() - 6);
      return {
        start: start,
        end: now,
      };
    }
    if (dateRange === "last30Days") {
      // Last 30 days including today
      const start = new Date();
      start.setDate(now.getDate() - 29);
      return {
        start: start,
        end: now,
      };
    }
    if (dateRange === "last3Months") {
      // Last 3 months (90 days)
      const start = new Date();
      start.setDate(now.getDate() - 90);
      return {
        start: start,
        end: now,
      };
    }
    if (dateRange === "last6Months") {
      // Last 6 months (180 days)
      const start = new Date();
      start.setDate(now.getDate() - 180);
      return {
        start: start,
        end: now,
      };
    }
    if (dateRange === "last1Year") {
      // Last 1 year (365 days)
      const start = new Date();
      start.setDate(now.getDate() - 365);
      return {
        start: start,
        end: now,
      };
    }
    // Default to this month
    return {
      start: startOfMonth(now),
      end: endOfMonth(now),
    };
  };

  const { start, end } = getDateRange();
  const startDateStr = format(start, "yyyy-MM-dd");
  const endDateStr = format(end, "yyyy-MM-dd");

  const { data: stats } = useSuspenseDashboardStats(startDateStr, endDateStr);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your business performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="last7Days">Last 7 Days</SelectItem>
              <SelectItem value="last30Days">Last 30 Days</SelectItem>
              <SelectItem value="last3Months">Last 3 Months</SelectItem>
              <SelectItem value="last6Months">Last 6 Months</SelectItem>
              <SelectItem value="last1Year">Last 1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnalyticsDashboard stats={stats} />
    </div>
  );
};

const AnalyticsPage = () => {
  return (
    <Suspense fallback={<AnalyticsDashboardSkeleton />}>
      <AnalyticsPageContent />
    </Suspense>
  );
};

export default AnalyticsPage;
