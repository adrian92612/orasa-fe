import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentListSkeleton } from "./AppointmentListSkeleton";

export function AppointmentsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {/* Mock Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-16" />
          </div>
          <Skeleton className="h-10 w-40" /> {/* Button */}
        </div>

        {/* Content Skeleton */}
        <AppointmentListSkeleton />
      </div>
    </div>
  );
}
