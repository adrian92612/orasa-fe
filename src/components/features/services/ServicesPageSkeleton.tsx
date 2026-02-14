import { Skeleton } from "@/components/ui/skeleton";
import { ServiceListSkeleton } from "./ServiceListSkeleton";

export function ServicesPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-10 w-full" /> {/* Search */}
      <div className="min-h-[400px] space-y-8">
        <Skeleton className="h-10 w-[400px] mb-6" /> {/* Tabs */}
        <ServiceListSkeleton />
      </div>
    </div>
  );
}
