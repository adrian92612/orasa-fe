import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentListSkeleton } from "./AppointmentListSkeleton";
import { CommonPaginationSkeleton } from "@/components/common/CommonPaginationSkeleton";

const AppointmentsPageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-44 rounded-md" />
      </div>

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
