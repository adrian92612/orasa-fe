import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SavingIndicatorProps = {
  label?: string;
  className?: string;
  spinnerClassName?: string;
};

export const SavingIndicator = ({
  label = "Saving...",
  className,
  spinnerClassName,
}: SavingIndicatorProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground animate-pulse",
        className,
      )}
    >
      <Loader2 className={cn("h-3 w-3 animate-spin", spinnerClassName)} />
      {label}
    </div>
  );
};
