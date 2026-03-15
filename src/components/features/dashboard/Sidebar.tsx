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
import { useSidebar } from "@/context/sidebar-context";
import { BranchSwitcher } from "./BranchSwitcher";
import { useUser } from "@/context/UserContext";
import { useBranches } from "@/hooks/useBranches";
import { LogOut } from "lucide-react";
import { Link, useLocation } from "react-router";
import { NAV_ITEMS } from "@/constants/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarHeaderBrand } from "./SidebarHeaderBrand";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  onLogout: () => void;
};

const AppSidebar = ({ onLogout, ...props }: AppSidebarProps) => {
  const { user } = useUser();
  const { data: branches = [] } = useBranches();
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  const filteredNavItems = NAV_ITEMS.filter((item) => user?.role && item.allowedRoles.includes(user.role));

  const displayBusinessName = user?.businessName || "Orasa";

  return (
    <Sidebar {...props} className="border-primary">
      <SidebarHeader>
        <SidebarHeaderBrand
          title={displayBusinessName}
          subtitle={`${user?.role === "OWNER" ? "Owner" : "Staff"} ${user?.username}`}
        >
          {!!branches.length && (
            <div className="mt-2">
              <BranchSwitcher />
            </div>
          )}
        </SidebarHeaderBrand>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url} tooltip={item.title}>
                    <Link to={item.url} onClick={() => setOpenMobile(false)}>
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
};

export default AppSidebar;
