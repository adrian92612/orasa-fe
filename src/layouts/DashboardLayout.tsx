import { Suspense } from "react";
import { useUser } from "@/context/UserContext";
import { useSuspenseBranches } from "@/hooks/useBranches";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { useLocation } from "react-router";
import { Outlet } from "react-router";
import { NAV_ITEMS } from "@/constants/navigation";
import SubscriptionBanner from "@/components/features/subscription/SubscriptionBanner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/features/dashboard/DashboardHeader";
import { NoBranchAssigned } from "@/components/features/dashboard/NoBranchAssigned";
import AppSidebar from "@/components/features/dashboard/Sidebar";

const DashboardLayout = () => {
  const { user, logout, selectedBranchId } = useUser();
  const location = useLocation();
  const { data: branches } = useSuspenseBranches();

  const currentItem = NAV_ITEMS.find((item) => location.pathname === item.url);
  const pageTitle = currentItem ? currentItem.title : "Dashboard";

  const currentBranch = branches?.find((b) => b.id === selectedBranchId);
  const branchName = currentBranch ? currentBranch.name : "All Branches";
  const isStaffNoBranches = user?.role === "STAFF" && !branches?.length;
  const isBranchAware = currentItem?.isBranchAware ?? true;

  return (
    <SidebarProvider>
      <AppSidebar onLogout={logout} />
      <SidebarInset>
        <DashboardHeader
          pageTitle={pageTitle}
          branchName={branchName}
          isBranchAware={isBranchAware}
        />

        <SubscriptionBanner />

        <div className="flex flex-1 flex-col gap-4 pt-0">
          <div className="min-h-dvh flex-1 md:min-h-min p-4">
            {isStaffNoBranches ? (
              <NoBranchAssigned />
            ) : (
              <Suspense fallback={<PageSkeleton />}>
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
