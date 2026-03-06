import { useSidebar } from "@/context/sidebar-context";
import { X } from "lucide-react";
import orasaLogoLight from "@/assets/orasa_logo_light.webp";
import { Button } from "@/components/ui/button";

type SidebarHeaderBrandProps = {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  children?: React.ReactNode;
};

export function SidebarHeaderBrand({ title, subtitle, children }: SidebarHeaderBrandProps) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center shrink-0">
            <img src={orasaLogoLight} alt="Orasa Logo" className="size-8" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none ">
            <span className="font-semibold text-sm tracking-tight line-clamp-1 break-all">{title}</span>
            <span className="text-xs text-sidebar-foreground/75 truncate max-w-40 block">{subtitle}</span>
          </div>
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            onClick={() => setOpenMobile(false)}
            className="md:hidden p-2 text-sidebar-foreground/50"
          >
            <X className="size-6" />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
