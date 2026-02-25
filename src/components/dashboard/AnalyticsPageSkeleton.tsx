import { Skeleton } from "@/components/ui/skeleton";
import AnalyticsDashboardSkeleton from "./AnalyticsDashboardSkeleton";

export default function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Skeleton className="h-5 w-[250px]" />
        <Skeleton className="h-10 w-full sm:w-[280px] rounded-md" />
      </div>

      <AnalyticsDashboardSkeleton />
    </div>
  );
}
