import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const TimeInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <Input
        type="time"
        ref={ref}
        className={cn(
          "pr-10 w-full",
          "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:z-10",
        )}
        {...props}
      />
      <Clock className="absolute right-3 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
});

TimeInput.displayName = "TimeInput";

export { TimeInput };
