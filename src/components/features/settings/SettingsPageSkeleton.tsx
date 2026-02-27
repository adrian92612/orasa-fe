import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full rounded-xl" />

      <div className="mt-6">
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>
    </div>
  );
}
