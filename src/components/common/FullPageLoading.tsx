import { Loader2 } from "lucide-react";

export const FullPageLoading = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-3xl font-bold shadow-xl animate-pulse">
          O
        </div>
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-lg font-bold tracking-[0.2em] uppercase text-foreground">
            Orasa
          </span>
        </div>
      </div>
    </div>
  );
};

export default FullPageLoading;
