import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

type DashboardHeaderProps = {
  pageTitle: string;
  branchName: string;
  isBranchAware: boolean;
};

export const DashboardHeader = ({
  pageTitle,
  branchName,
  isBranchAware,
}: DashboardHeaderProps) => {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b border-primary dark:bg-sidebar px-4 backdrop-blur-xl">
      <SidebarTrigger className="-ml-1 text-foreground" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex items-center justify-between w-full gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-foreground font-semibold text-lg truncate">
            {pageTitle}
          </h1>
          <span className="text-foreground text-sm truncate block">
            {isBranchAware ? branchName : "Business Wide"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground border-l pl-4">
          {new Date().toLocaleDateString("en-US", {
            weekday: isMobile ? "short" : "long",
            month: isMobile ? "short" : "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>
    </header>
  );
};
