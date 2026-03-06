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
} from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";
import { LogOut, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router";
import { APP_ROUTES } from "@/constants/routes";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarHeaderBrand } from "./SidebarHeaderBrand";

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onLogout: () => void;
}

export function AdminSidebar({ onLogout, ...props }: AdminSidebarProps) {
  const { user } = useUser();
  const location = useLocation();

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
        <SidebarHeaderBrand title="Orasa Admin" subtitle={user?.username} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url} tooltip={item.title}>
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
