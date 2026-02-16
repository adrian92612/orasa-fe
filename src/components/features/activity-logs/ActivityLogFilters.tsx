import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Input } from "@/components/ui/input"; (Unused for now)
// import { Search } from "lucide-react"; (Unused for now)

interface ActivityLogFiltersProps {
  action: string;
  onActionChange: (value: string) => void;
  isLoading?: boolean;
}

const ActivityLogFilters = ({
  action,
  onActionChange,
  isLoading,
}: ActivityLogFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="w-full sm:w-[200px]">
        <Select
          value={action}
          onValueChange={(value) =>
            onActionChange(value === "ALL" ? "" : value)
          }
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Actions</SelectItem>
            <SelectItem value="APPOINTMENT_CREATED">
              Appointment Created
            </SelectItem>
            <SelectItem value="APPOINTMENT_UPDATED">
              Appointment Updated
            </SelectItem>
            <SelectItem value="APPOINTMENT_DELETED">
              Appointment Deleted
            </SelectItem>
            <SelectItem value="APPOINTMENT_STATUS_CHANGED">
              Status Changed
            </SelectItem>
            <SelectItem value="USER_LOGIN">User Login</SelectItem>
            <SelectItem value="USER_LOGOUT">User Logout</SelectItem>
            <SelectItem value="STAFF_CREATED">Staff Created</SelectItem>
            <SelectItem value="STAFF_UPDATED">Staff Updated</SelectItem>
            <SelectItem value="SERVICE_CREATED">Service Created</SelectItem>
            <SelectItem value="SERVICE_UPDATED">Service Updated</SelectItem>
            <SelectItem value="reminders">Reminders (Any)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Picker Could Go Here */}
    </div>
  );
};

export default ActivityLogFilters;
