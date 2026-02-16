import { Skeleton } from "@/components/ui/skeleton";
import { StaffListSkeleton } from "./StaffListSkeleton";

export default function StaffPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <StaffListSkeleton />
    </div>
  );
}
