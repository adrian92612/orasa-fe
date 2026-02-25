import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export function DashboardSkeleton() {
  return (
    <SidebarProvider>
      <div className="hidden h-screen w-[256px] border-r bg-sidebar md:flex flex-col">
        <div className="flex flex-col items-center gap-2 min-h-28 p-5">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <div className="flex-1 space-y-4 p-5 pt-4">
          <Skeleton className="h-5 w-16 rounded-lg" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-lg" />
          ))}
        </div>

        <div className="p-5">
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      </div>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </header>

        <main className="pt-4 px-4">
          <PageSkeleton />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
