import { Skeleton } from "@/components/ui/skeleton";

export const ActivityLogSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  );
};

export default ActivityLogSkeleton;
