import { Skeleton } from "@/components/ui/skeleton";

export function BranchListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-[262px] w-full rounded-xl" />
      ))}
    </div>
  );
}
