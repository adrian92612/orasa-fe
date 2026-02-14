import { Suspense, lazy } from "react";
import { useUser } from "@/context/UserContext";
import { useSuspenseBranches } from "@/hooks/useBranches";
const AppSidebar = lazy(
  () => import("@/components/features/dashboard/Sidebar"),
);
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Building2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NAV_ITEMS } from "@/constants/navigation";
import { useLocation } from "react-router";
import { Outlet } from "react-router";
import SubscriptionBanner from "@/components/features/subscription/SubscriptionBanner";
import { DashboardSkeleton } from "@/components/features/dashboard/DashboardSkeleton";

const DashboardLayout = () => {
  const {
    user,
    logout,
    selectedBranchId,
    isLoading: isLoadingUser,
  } = useUser();
  const location = useLocation();
  const { data: branches } = useSuspenseBranches();

  if (isLoadingUser) {
    return <DashboardSkeleton />;
  }

  const currentItem = NAV_ITEMS.find((item) => location.pathname === item.url);
  const pageTitle = currentItem ? currentItem.title : "Dashboard";

  const currentBranch = branches?.find((b) => b.id === selectedBranchId);
  const branchName = currentBranch ? currentBranch.name : "All Branches";
  const isStaffNoBranches = user?.role === "STAFF" && !branches?.length;

  return (
    <SidebarProvider>
      <Suspense
        fallback={
          <div className="h-screen w-[270px] border-r bg-sidebar hidden md:block" />
        }
      >
        <AppSidebar onLogout={logout} />
      </Suspense>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="font-semibold text-lg">{pageTitle}</h1>
                <span className="text-muted-foreground text-sm">
                  {branchName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground border-l pl-4">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </header>

        <SubscriptionBanner />

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-slate-50/50">
          <div className="min-h-dvh flex-1 rounded-xl bg-background/50 md:min-h-min p-4">
            {isStaffNoBranches ? (
              <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Building2 className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    No Branch Assigned
                  </h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    You currently don't have access to any branches. Please
                    contact the business owner to get assigned to a branch.
                  </p>
                </div>
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="space-y-4">
                    <div className="h-64 animate-pulse rounded bg-muted" />
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
