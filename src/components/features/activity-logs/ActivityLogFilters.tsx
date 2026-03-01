import type { DateRange } from "react-day-picker";

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
import { endOfMonth, startOfMonth, subDays, subMonths } from "date-fns";

interface ActivityLogFiltersProps {
  action: string;
  onActionChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  isLoading?: boolean;
}

const ACTION_OPTIONS = [
  { label: "All Actions", value: "ALL" },
  {
    label: "Created",
    value:
      "APPOINTMENT_CREATED,STAFF_CREATED,BRANCH_CREATED,SERVICE_CREATED,BUSINESS_CREATED",
  },
  {
    label: "Updated",
    value:
      "APPOINTMENT_UPDATED,STAFF_UPDATED,BRANCH_UPDATED,SERVICE_UPDATED,PROFILE_UPDATED,REMINDER_CONFIG_UPDATED,BUSINESS_UPDATED",
  },
  {
    label: "Deleted",
    value:
      "APPOINTMENT_DELETED,BRANCH_DELETED,SERVICE_DELETED,STAFF_DEACTIVATED",
  },
  { label: "Status", value: "APPOINTMENT_STATUS_CHANGED" },
  { label: "Login", value: "USER_LOGIN" },
  { label: "Logout", value: "USER_LOGOUT" },
  { label: "Password", value: "STAFF_PASSWORD_RESET,PASSWORD_CHANGED" },
] as const;

const ActivityLogFilters = ({
  action,
  onActionChange,
  dateRange,
  onDateRangeChange,
  isLoading,
}: ActivityLogFiltersProps) => {
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
        value={action}
        onValueChange={onActionChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Action" />
        </SelectTrigger>
        <SelectContent>
          {ACTION_OPTIONS.map((option) => (
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
          presets={presets}
          className="w-full md:w-[260px]"
          disabled={{ after: new Date() }}
        />
      </div>
    </div>
  );
};

export default ActivityLogFilters;
