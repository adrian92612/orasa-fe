import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";
import { LogOut, X, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router";
import { APP_ROUTES } from "@/constants/routes";
import { ModeToggle } from "@/components/mode-toggle";

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onLogout: () => void;
}

export function AdminSidebar({ onLogout, ...props }: AdminSidebarProps) {
  const { user } = useUser();
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  const navItems = [
    {
      title: "Businesses",
      url: APP_ROUTES.ADMIN.DASHBOARD,
      icon: LayoutDashboard,
    },
    // Future: Add Logs or other admin features here
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold shrink-0">
                A
              </div>
              <div className="flex flex-col gap-0.5 leading-none ">
                <span className="font-semibold text-sm tracking-tight">
                  Orasa Admin
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-40 block">
                  {user?.username}
                </span>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={() => setOpenMobile(false)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between px-2 w-full">
              <SidebarMenuButton
                onClick={onLogout}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 hover:cursor-pointer w-auto"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
              <ModeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
