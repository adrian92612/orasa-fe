import { Skeleton } from "@/components/ui/skeleton";
import SmsLogSkeleton from "./SmsLogSkeleton";
import { CommonPaginationSkeleton } from "@/components/common/CommonPaginationSkeleton";

export default function SmsLogsPageSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filters Skeleton */}
      <div className="flex flex-col md:flex-row gap-3 w-full">
        <Skeleton className="h-9 w-full md:w-[180px]" />
        <Skeleton className="h-9 w-full md:w-[260px]" />
      </div>

      {/* List Skeleton */}
      <SmsLogSkeleton />

      {/* Pagination Skeleton */}
      <CommonPaginationSkeleton />
    </div>
  );
}
