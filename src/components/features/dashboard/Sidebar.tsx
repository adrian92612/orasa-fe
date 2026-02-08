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
import { useBranches } from "@/hooks/useBranches";
import { LogOut, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import { NAV_ITEMS } from "@/constants/navigation";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  onLogout: () => void;
};

const AppSidebar = ({ onLogout, ...props }: AppSidebarProps) => {
  const { user } = useUser();
  const { data: branches = [] } = useBranches();
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  const filteredNavItems = NAV_ITEMS.filter(
    (item) => user?.role && item.allowedRoles.includes(user.role),
  );

  const displayBusinessName = user?.businessName || "Orasa";

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shrink-0">
                {displayBusinessName.charAt(0)}
              </div>
              <div className="flex flex-col gap-0.5 leading-none ">
                <span className="font-semibold text-sm tracking-tight line-clamp-1 break-all">
                  {displayBusinessName}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-[160px] block">
                  {user?.role === "OWNER" ? "Owner" : "Staff"} {user?.username}
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

          {(user?.role === "OWNER" || branches.length > 1) && (
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
