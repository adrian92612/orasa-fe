import { Skeleton } from "@/components/ui/skeleton";
import { BranchListSkeleton } from "./BranchListSkeleton";

export default function BranchesPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-[120px]" />
      </div>

      <BranchListSkeleton />
    </div>
  );
}
