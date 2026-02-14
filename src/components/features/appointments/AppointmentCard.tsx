import {
  MoreVertical,
  Calendar,
  Phone,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  AppointmentResponse,
  AppointmentStatus,
} from "@/types/appointment";
import { cn } from "@/lib/utils";

const statusColors: Record<AppointmentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-gray-100 text-gray-800",
};

type AppointmentCardProps = {
  appointment: AppointmentResponse;
  onEdit: (appointment: AppointmentResponse) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (
    appointment: AppointmentResponse,
    status: AppointmentStatus,
  ) => void;
};

const AppointmentCard = ({
  appointment,
  onEdit,
  onDelete,
  onStatusChange,
}: AppointmentCardProps) => {
  const start = new Date(appointment.startDateTime);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="group flex flex-col md:flex-row md:items-center justify-between p-4 gap-4 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      {/* Left: Time & Date */}
      <div className="flex md:flex-col items-center md:items-start gap-2 md:gap-1 min-w-[100px] border-b md:border-b-0 md:border-r pb-3 md:pb-0 pr-0 md:pr-4">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <Clock className="h-4 w-4 text-primary" />
          <span>{formatTime(start)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(start)}</span>
        </div>
      </div>

      {/* Middle: Customer & Service Info */}
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-lg">
            {appointment.customerName}
          </span>
          {appointment.type === "WALK_IN" && (
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-bold tracking-wider border-orange-200 bg-orange-50 text-orange-700"
            >
              Walk-In
            </Badge>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 gap-x-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            <span>{appointment.customerPhone}</span>
          </div>
          {appointment.serviceName && (
            <div className="hidden sm:block text-border">|</div>
          )}
          {appointment.serviceName && (
            <div className="font-medium text-foreground/80">
              {appointment.serviceName}
            </div>
          )}
        </div>

        {appointment.notes && (
          <div className="text-xs text-muted-foreground italic truncate max-w-md">
            Note: {appointment.notes}
          </div>
        )}
      </div>

      {/* Right: Actions & Status */}
      <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 mt-1 md:mt-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                statusColors[appointment.status],
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                "text-[11px] font-bold uppercase tracking-wider transition-all",
                "hover:cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-muted-foreground/20 active:scale-95",
              )}
            >
              {appointment.status.replace("_", " ")}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.keys(statusColors).map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() =>
                  onStatusChange?.(appointment, status as AppointmentStatus)
                }
                disabled={status === appointment.status}
              >
                {status.replace("_", " ")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(appointment)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(appointment.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AppointmentCard;
