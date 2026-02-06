import { useUser } from "@/context/UserContext";
import AppSidebar from "@/components/features/dashboard/Sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { NAV_ITEMS } from "@/constants/navigation";
import { useLocation } from "react-router";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  const { logout } = useUser();
  const location = useLocation();

  const currentItem = NAV_ITEMS.find((item) => location.pathname === item.url);
  const pageTitle = currentItem ? currentItem.title : "Dashboard";

  return (
    <SidebarProvider>
      <AppSidebar onLogout={logout} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-semibold text-lg">{pageTitle}</h1>
              <div className="text-sm text-muted-foreground border-l pl-4">
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-slate-50/50">
          <div className="min-h-dvh flex-1 rounded-xl bg-background/50 md:min-h-min p-4">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
