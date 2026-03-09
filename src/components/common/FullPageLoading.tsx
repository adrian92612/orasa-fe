import { Loader2 } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export const FullPageLoading = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
        <div className="flex items-center justify-center animate-pulse">
          <BrandLogo showText={false} logoClassName="size-20" />
        </div>
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-lg font-bold tracking-[0.2em] uppercase text-foreground">Orasa</span>
        </div>
      </div>
    </div>
  );
};

export default FullPageLoading;
