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
import { BranchSwitcher } from "./BranchSwitcher";
import { useUser } from "@/context/UserContext";
import { LogOut, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import { NAV_ITEMS } from "@/constants/navigation";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  onLogout: () => void;
};

const AppSidebar = ({ onLogout, ...props }: AppSidebarProps) => {
  const { user } = useUser();
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  const filteredNavItems =
    user?.role === "STAFF"
      ? NAV_ITEMS.filter((item) => item.title === "Appointments")
      : NAV_ITEMS;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shrink-0">
                {user?.businessName
                  ? user.businessName.charAt(0).toUpperCase()
                  : "O"}
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-sm tracking-tight line-clamp-1 break-all">
                  {user?.businessName || "Orasa"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user?.role === "OWNER" ? "Owner" : "Staff"}
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

          {(user?.role === "OWNER" || (user?.branches?.length || 0) > 1) && (
            <div className="mt-2">
              <BranchSwitcher />
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
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
            <div className="text-sm text-gray-500">{user?.username}</div>

            <SidebarMenuButton
              onClick={onLogout}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 hover:cursor-pointer"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
