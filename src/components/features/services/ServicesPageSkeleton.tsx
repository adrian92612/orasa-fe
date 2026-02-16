import { Skeleton } from "@/components/ui/skeleton";
import { ServiceListSkeleton } from "./ServiceListSkeleton";

export default function ServicesPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <ServiceListSkeleton />
    </div>
  );
}
