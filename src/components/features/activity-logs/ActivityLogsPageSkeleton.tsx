import { Skeleton } from "@/components/ui/skeleton";
import ActivityLogSkeleton from "./ActivityLogSkeleton";
import { CommonPaginationSkeleton } from "@/components/common/CommonPaginationSkeleton";

export default function ActivityLogsPageSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filters Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-full sm:w-[150px]" />
          <Skeleton className="h-10 w-full sm:w-[250px]" />
        </div>
      </div>

      {/* List Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <ActivityLogSkeleton key={i} />
        ))}
      </div>

      {/* Pagination Skeleton */}
      <CommonPaginationSkeleton />
    </div>
  );
}
