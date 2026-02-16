import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function AppointmentListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card
          key={i}
          className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4 rounded-xl border bg-card shadow-sm"
        >
          {/* Left: Time & Date */}
          <div className="flex md:flex-col items-center md:items-start gap-2 md:gap-1 min-w-[100px] border-b md:border-b-0 md:border-r pb-3 md:pb-0 pr-0 md:pr-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>

          {/* Middle: Customer & Service Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 mt-1 md:mt-0">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </Card>
      ))}
    </div>
  );
}
