import { Skeleton } from "@/components/ui/skeleton";
import { StaffListSkeleton } from "./StaffListSkeleton";

export default function StaffPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:w-96" />

        <Skeleton className="h-8 w-full sm:w-[109px]" />
      </div>

      <StaffListSkeleton />
    </div>
  );
}
