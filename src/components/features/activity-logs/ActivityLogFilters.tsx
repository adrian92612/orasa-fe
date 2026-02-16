import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";

interface ActivityLogFiltersProps {
  action: string;
  onActionChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  isLoading?: boolean;
}

const ActivityLogFilters = ({
  action,
  onActionChange,
  dateRange,
  onDateRangeChange,
  isLoading,
}: ActivityLogFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <div className="w-full md:w-[180px]">
        <Select
          value={action}
          onValueChange={onActionChange}
          disabled={isLoading}
        >
          <SelectTrigger className="h-9 border-black ">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Actions</SelectItem>
            <SelectItem value="APPOINTMENT_CREATED">Created</SelectItem>
            <SelectItem value="APPOINTMENT_UPDATED">Updated</SelectItem>
            <SelectItem value="APPOINTMENT_DELETED">Deleted</SelectItem>
            <SelectItem value="APPOINTMENT_STATUS_CHANGED">Status</SelectItem>
            <SelectItem value="USER_LOGIN">Login</SelectItem>
            <SelectItem value="USER_LOGOUT">Logout</SelectItem>
            <SelectItem value="reminders">Reminders</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-auto">
        <DateRangePicker
          date={dateRange}
          setDate={onDateRangeChange}
          className="w-full md:w-[260px]"
        />
      </div>
    </div>
  );
};

export default ActivityLogFilters;
