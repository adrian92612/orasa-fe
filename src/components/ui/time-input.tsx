import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TimeInputProps = {
  value?: string; // "HH:mm" format (24h)
  onChange?: (value: string) => void;
  className?: string;
};

const TimeInput = React.forwardRef<HTMLDivElement, TimeInputProps>(
  ({ className, value, onChange }, ref) => {
    const getNow = () => {
      const now = new Date();
      const h24 = now.getHours();
      const p = h24 >= 12 ? "PM" : "AM";
      let h12 = h24 % 12;
      if (h12 === 0) h12 = 12;
      return {
        h: h12.toString().padStart(2, "0"),
        m: now.getMinutes().toString().padStart(2, "0"),
        p: p as "AM" | "PM",
      };
    };

    const initial = getNow();
    const [hours, setHours] = React.useState(initial.h);
    const [minutes, setMinutes] = React.useState(initial.m);
    const [period, setPeriod] = React.useState<"AM" | "PM">(initial.p);

    // Sync internal state with prop value
    React.useEffect(() => {
      if (value) {
        const [h24, m] = value.split(":");
        const h24Int = parseInt(h24, 10);
        const p = h24Int >= 12 ? "PM" : "AM";
        let h12 = h24Int % 12;
        if (h12 === 0) h12 = 12;

        setHours(h12.toString().padStart(2, "0"));
        setMinutes(m || "00");
        setPeriod(p);
      }
    }, [value]);

    const handleUpdate = (h: string, m: string, p: "AM" | "PM") => {
      let h24 = parseInt(h, 10);
      if (p === "PM" && h24 < 12) h24 += 12;
      if (p === "AM" && h24 === 12) h24 = 0;

      const formattedValue = `${h24.toString().padStart(2, "0")}:${m.padStart(2, "0")}`;
      onChange?.(formattedValue);
    };

    const hourOptions = Array.from({ length: 12 }, (_, i) =>
      (i + 1).toString().padStart(2, "0"),
    );
    const minuteOptions = Array.from({ length: 60 }, (_, i) =>
      i.toString().padStart(2, "0"),
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-9 w-full items-center gap-1 rounded-md border border-primary dark:bg-input/30 p-1 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          className,
        )}
      >
        <Select
          value={hours}
          onValueChange={(val) => {
            setHours(val);
            handleUpdate(val, minutes, period);
          }}
        >
          <SelectTrigger className="max-h-8 border-none bg-transparent px-2 hover:bg-muted focus:ring-0 shadow-none dark:bg-transparent [&_svg]:hidden">
            <SelectValue placeholder="HH" />
          </SelectTrigger>
          <SelectContent className="min-w-17.5">
            {hourOptions.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-muted-foreground font-mono">:</span>

        <Select
          value={minutes}
          onValueChange={(val) => {
            setMinutes(val);
            handleUpdate(hours, val, period);
          }}
        >
          <SelectTrigger className="max-h-8 border-none bg-transparent px-2 hover:bg-muted focus:ring-0 shadow-none [&_svg]:hidden">
            <SelectValue placeholder="MM" />
          </SelectTrigger>
          <SelectContent className="min-w-17.5 max-h-60">
            {minuteOptions.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={period}
          onValueChange={(val: string) => {
            const p = val as "AM" | "PM";
            setPeriod(p);
            handleUpdate(hours, minutes, p);
          }}
        >
          <SelectTrigger className="max-h-8 border-none bg-transparent px-2 text-[10px] font-bold hover:bg-muted focus:ring-0 shadow-none [&_svg]:hidden rounded-sm ml-auto mr-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-16">
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>

        <Clock className="h-4 w-4 text-muted-foreground shrink-0 pointer-events-none mr-1" />
      </div>
    );
  },
);

TimeInput.displayName = "TimeInput";

export { TimeInput };
