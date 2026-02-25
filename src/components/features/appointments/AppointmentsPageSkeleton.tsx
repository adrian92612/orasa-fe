import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentListSkeleton } from "./AppointmentListSkeleton";
import { CommonPaginationSkeleton } from "@/components/common/CommonPaginationSkeleton";

const AppointmentsPageSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Tabs & New Appointment Button Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex bg-muted p-1 rounded-md">
          <Skeleton className="h-8 w-24 bg-background/50" />
          <Skeleton className="h-8 w-24 bg-transparent" />
          <Skeleton className="h-8 w-16 bg-transparent" />
        </div>
        <Skeleton className="h-10 w-44 rounded-md" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap mb-5">
        <div className="flex flex-col sm:flex-row gap-2 flex-1 flex-wrap">
          <Skeleton className="h-10 w-full sm:w-[140px]" />
          <Skeleton className="h-10 w-full sm:w-[140px]" />
        </div>

        <div className="relative w-full sm:w-[300px]">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <AppointmentListSkeleton />
      <CommonPaginationSkeleton />
    </div>
  );
};

export default AppointmentsPageSkeleton;
