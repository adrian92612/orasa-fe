import { Skeleton } from "@/components/ui/skeleton";

export function StaffListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-[84px] w-full rounded-xl" />
      ))}
    </div>
  );
}
