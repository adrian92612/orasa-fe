import {
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
} from "date-fns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  { value: "ALL", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "NO_SHOW", label: "No Show" },
];

const TYPE_OPTIONS = [
  { value: "ALL", label: "All Types" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "WALK_IN", label: "Walk-in" },
];

type AppointmentFiltersProps = {
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  typeFilter: string;
  setTypeFilter: (val: string) => void;
  searchInput: string;
  setSearchInput: (val: string) => void;
  onPageReset: () => void;
  includeDateRange?: boolean;
  dateRange?: { from: Date; to: Date };
  onDateRangeChange?: (range: { from: Date; to: Date }) => void;
};

export const AppointmentFilters = ({
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  searchInput,
  setSearchInput,
  onPageReset,
  includeDateRange = false,
  dateRange,
  onDateRangeChange,
}: AppointmentFiltersProps) => {
  const today = new Date();
  const presets: DatePreset[] = [
    { label: "Today", date: { from: today, to: today } },
    {
      label: "Yesterday",
      date: { from: subDays(today, 1), to: subDays(today, 1) },
    },
    { label: "Last 7 Days", date: { from: subDays(today, 6), to: today } },
    { label: "Last 30 Days", date: { from: subDays(today, 29), to: today } },
    {
      label: "This Month",
      date: { from: startOfMonth(today), to: endOfMonth(today) },
    },
    {
      label: "Last Month",
      date: {
        from: startOfMonth(subMonths(today, 1)),
        to: endOfMonth(subMonths(today, 1)),
      },
    },
    { label: "Next 30 Days", date: { from: today, to: addMonths(today, 1) } },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap mb-5">
      <div className="flex flex-col sm:flex-row gap-2 flex-1 flex-wrap">
        {includeDateRange && dateRange && onDateRangeChange && (
          <DateRangePicker
            date={{ from: dateRange.from, to: dateRange.to }}
            presets={presets}
            setDate={(range) => {
              if (range?.from) {
                onDateRangeChange({
                  from: range.from,
                  to: range.to || range.from,
                });
                onPageReset();
              }
            }}
          />
        )}

        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            onPageReset();
          }}
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={typeFilter}
          onValueChange={(val) => {
            setTypeFilter(val);
            onPageReset();
          }}
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative w-full sm:w-[300px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search customers, phone, notes..."
          className="pl-9 w-full"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
    </div>
  );
};
