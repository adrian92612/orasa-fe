import type { DateRange } from "react-day-picker";
import { endOfMonth, startOfMonth, subDays, subMonths } from "date-fns";

import {
  DateRangePicker,
  type DatePreset,
} from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_OPTIONS = [
  { label: "All Status", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Failed", value: "FAILED" },
] as const;

interface SmsLogFiltersProps {
  status: string;
  onStatusChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  isLoading?: boolean;
}

const SmsLogFilters = ({
  status,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  isLoading,
}: SmsLogFiltersProps) => {
  const now = new Date();
  const presets: DatePreset[] = [
    { label: "Today", date: { from: now, to: now } },
    {
      label: "Yesterday",
      date: { from: subDays(now, 1), to: subDays(now, 1) },
    },
    { label: "Last 7 Days", date: { from: subDays(now, 6), to: now } },
    { label: "Last 30 Days", date: { from: subDays(now, 29), to: now } },
    {
      label: "This Month",
      date: { from: startOfMonth(now), to: endOfMonth(now) },
    },
    {
      label: "Last Month",
      date: {
        from: startOfMonth(subMonths(now, 1)),
        to: endOfMonth(subMonths(now, 1)),
      },
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <Select
        value={status}
        onValueChange={onStatusChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="w-full md:w-auto">
        <DateRangePicker
          date={dateRange}
          setDate={onDateRangeChange}
          className="w-full md:w-[260px]"
          presets={presets}
          disabled={{ after: new Date() }}
        />
      </div>
    </div>
  );
};

export default SmsLogFilters;
