import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ServiceListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card
          key={i}
          className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4"
        >
          <div className="flex flex-1 items-center gap-4 min-w-0">
            <Skeleton className="h-6 w-10 rounded-full" /> {/* Switch */}
            <Skeleton className="h-10 w-10 rounded-lg" /> {/* Icon */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16 hidden sm:block" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </Card>
      ))}
    </div>
  );
}
