import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";

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
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <div className="w-full md:w-[180px]">
        <Select
          value={status}
          onValueChange={onStatusChange}
          disabled={isLoading}
        >
          <SelectTrigger className="h-9 border-black">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
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

export default SmsLogFilters;
