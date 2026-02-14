import { Skeleton } from "@/components/ui/skeleton";
import { StaffListSkeleton } from "./StaffListSkeleton";

export function StaffPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 max-w-sm w-full">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <Skeleton className="h-9 w-24" /> {/* Add Staff Button */}
      </div>

      <StaffListSkeleton />
    </div>
  );
}
