import { Skeleton } from "@/components/ui/skeleton";
import { ServiceListSkeleton } from "./ServiceListSkeleton";
import { CommonPaginationSkeleton } from "@/components/common/CommonPaginationSkeleton";

export default function ServicesPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="relative w-screen sm:w-[300px] mb-4">
        <Skeleton className="h-10 w-full" />
      </div>

      <ServiceListSkeleton />
      <CommonPaginationSkeleton />
    </div>
  );
}
