import { Skeleton } from "@/components/ui/skeleton";
import { BranchListSkeleton } from "./BranchListSkeleton";

export function BranchesPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>

      <BranchListSkeleton />
    </div>
  );
}
