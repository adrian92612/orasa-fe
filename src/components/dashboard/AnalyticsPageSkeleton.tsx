import { Skeleton } from "@/components/ui/skeleton";
import AnalyticsDashboardSkeleton from "./AnalyticsDashboardSkeleton";

export default function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-9 w-[300px]" />
      </div>

      <AnalyticsDashboardSkeleton />
    </div>
  );
}
