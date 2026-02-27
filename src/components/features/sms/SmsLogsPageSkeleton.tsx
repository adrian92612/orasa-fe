import { Skeleton } from "@/components/ui/skeleton";
import SmsLogSkeleton from "./SmsLogSkeleton";
import { CommonPaginationSkeleton } from "@/components/common/CommonPaginationSkeleton";

export default function SmsLogsPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 w-full">
        <Skeleton className="h-9 w-[107px]" />
        <Skeleton className="h-9 w-[300px]" />
      </div>

      <SmsLogSkeleton />

      <CommonPaginationSkeleton />
    </div>
  );
}
