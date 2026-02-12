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
    <div className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-lg">
              {appointment.customerName}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    statusColors[appointment.status],
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                    "text-[10px] font-bold uppercase tracking-wider transition-all",
                    "hover:cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-muted-foreground/20 active:scale-95",
                  )}
                >
                  {appointment.status.replace("_", " ")}
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
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

            {appointment.type === "WALK_IN" && (
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-bold tracking-wider border-orange-200 bg-orange-50 text-orange-700"
              >
                Walk-In
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />
            <span>{appointment.customerPhone}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
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

      <div className="px-4 py-3 border-t bg-muted/5 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{formatDate(start)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{formatTime(start)}</span>
        </div>
        {appointment.serviceName && (
          <div className="text-sm text-muted-foreground pt-1">
            Service:{" "}
            <span className="font-medium text-foreground">
              {appointment.serviceName}
            </span>
          </div>
        )}
      </div>

      {appointment.notes && (
        <div className="px-4 py-2 text-xs border-t text-muted-foreground italic truncate">
          {appointment.notes}
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
