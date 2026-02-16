import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentListSkeleton } from "./AppointmentListSkeleton";

const AppointmentsPageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-8 w-[150px]" />
      </div>
      <AppointmentListSkeleton />
    </div>
  );
};

export default AppointmentsPageSkeleton;
