import { Skeleton } from "@/components/ui/skeleton";

export function AppointmentListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-64 md:h-24 w-full rounded-xl" />
      ))}
    </div>
  );
}
