import { Skeleton } from "@/components/ui/skeleton";
import { BranchListSkeleton } from "./BranchListSkeleton";

export default function BranchesPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-full sm:w-80" />
        <Skeleton className="h-9 w-full sm:w-32" />
      </div>

      <BranchListSkeleton />
    </div>
  );
}
