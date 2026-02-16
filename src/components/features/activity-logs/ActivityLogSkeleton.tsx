import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ActivityLogSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="rounded-lg border bg-card p-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ActivityLogSkeleton;
