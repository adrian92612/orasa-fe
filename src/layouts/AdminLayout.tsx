import { Suspense } from "react";
import { useUser } from "@/context/UserContext";
import { AdminSidebar } from "@/components/features/dashboard/AdminSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Outlet } from "react-router";

const AdminLayout = () => {
  const { logout } = useUser();

  return (
    <SidebarProvider>
      <AdminSidebar onLogout={logout} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <div className="flex flex-1 items-center justify-between">
            <h1 className="font-semibold text-lg">Platform Administration</h1>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 pt-0">
          <div className="min-h-dvh flex-1 md:min-h-min p-4">
            <Suspense
              fallback={
                <div className="space-y-4">
                  <div className="h-64 animate-pulse rounded bg-muted" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
