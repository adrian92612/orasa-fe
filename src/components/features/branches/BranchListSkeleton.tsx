import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function BranchListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card
          key={i}
          className="rounded-xl border bg-card p-6 shadow-sm space-y-4"
        >
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
