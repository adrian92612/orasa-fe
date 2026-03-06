import { useState } from "react";
import { MoreVertical, Calendar, Phone, Clock, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SavingIndicator } from "@/components/common/SavingIndicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteDialog from "@/components/common/DeleteDialog";
import type { AppointmentResponse, AppointmentStatus } from "@/types/appointment";
import { cn } from "@/lib/utils";
import { useMyBusiness } from "@/hooks/useBusiness";

const statusColors: Record<AppointmentStatus, string> = {
  PENDING: "bg-slate-100 text-slate-600 border border-slate-200",
  CONFIRMED: "bg-accent/50 text-accent-foreground border border-accent",
  COMPLETED: "bg-primary text-primary-foreground border border-primary",
  CANCELLED: "bg-white text-slate-500 border border-slate-200 line-through",
  NO_SHOW: "bg-slate-50 text-slate-400 border border-slate-200",
};

type AppointmentCardProps = {
  appointment: AppointmentResponse;
  isSaving?: boolean;
  onEdit: (appointment: AppointmentResponse) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (appointment: AppointmentResponse, status: AppointmentStatus) => void;
};

const AppointmentCard = ({ appointment, isSaving, onEdit, onDelete, onStatusChange }: AppointmentCardProps) => {
  const { data: business } = useMyBusiness();
  const canManageAppointments = business?.subscriptionStatus === "ACTIVE";

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

  const isOptimistic = appointment.id.startsWith("temp-");
  const showSaving = isOptimistic || isSaving;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <Card
        className={cn(
          "group flex flex-col md:flex-row md:items-start justify-between p-4 gap-4 transition-all hover:shadow-md",
          showSaving && "opacity-70 grayscale-[0.5]",
        )}
      >
        <div className="flex md:flex-col items-center md:items-start gap-2 md:gap-1 min-w-25 border-b md:border-b-0 md:border-r pb-3 md:pb-0 pr-0 md:pr-4">
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <Clock className="h-4 w-4 text-primary" />
            <span>{formatTime(start)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(start)}</span>
          </div>
        </div>

        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-lg">{appointment.customerName}</span>
            {appointment.type === "WALK_IN" && (
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-bold tracking-wider border-slate-300 bg-slate-100 text-slate-700"
              >
                Walk-In
              </Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 gap-x-4 text-sm text-muted-foreground min-w-0">
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              <span>{appointment.customerPhone}</span>
            </div>
            {appointment.services && appointment.services.length > 0 && (
              <div className="hidden sm:block text-border">|</div>
            )}
            {appointment.services && appointment.services.length > 0 && (
              <div className="flex items-center gap-1 truncate">
                <span className="font-medium text-foreground/80 truncate">
                  {appointment.services
                    .filter((s) => !s.deleted)
                    .map((s) => s.name)
                    .join(", ")}
                </span>
                {appointment.services.some((s) => s.deleted) && (
                  <span className="font-medium text-destructive/70 italic ml-1">(+ deleted service)</span>
                )}
              </div>
            )}
          </div>

          {appointment.notes && (
            <div className="text-xs text-muted-foreground italic whitespace-pre-wrap line-clamp-3 max-w-2xl mt-1">
              Note: {appointment.notes}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 mt-1 md:mt-0">
          {showSaving && <SavingIndicator />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={showSaving || !canManageAppointments}>
              <Button
                variant="ghost"
                title={!canManageAppointments ? "Subscription required to change status" : ""}
                className={cn(
                  statusColors[appointment.status],
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full h-auto",
                  "text-[11px] font-bold uppercase tracking-wider transition-all",
                  !showSaving && "hover:ring-2 hover:ring-offset-1 hover:ring-muted-foreground/20 active:scale-95",
                  showSaving
                    ? "cursor-wait"
                    : !canManageAppointments
                      ? "cursor-not-allowed opacity-50"
                      : "hover:cursor-pointer",
                )}
                disabled={!canManageAppointments}
              >
                {appointment.status.replace("_", " ")}
                {!showSaving && canManageAppointments && <ChevronDown className="h-3 w-3 opacity-60" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.keys(statusColors).map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => onStatusChange?.(appointment, status as AppointmentStatus)}
                  disabled={status === appointment.status}
                >
                  {status.replace("_", " ")}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={showSaving || !canManageAppointments}>
              <Button
                variant="ghost"
                size="icon"
                title={!canManageAppointments ? "Subscription required to edit appointments" : ""}
                className={cn(
                  "h-8 w-8 text-muted-foreground hover:text-foreground",
                  !canManageAppointments && "opacity-50",
                )}
                disabled={showSaving || !canManageAppointments}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(appointment)}>Edit</DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(e) => {
                  e.preventDefault();
                  setShowDeleteDialog(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => onDelete(appointment.id)}
        description={
          <>
            This action cannot be undone. This will permanently delete the appointment for{" "}
            <span className="font-medium text-foreground">{appointment.customerName}</span>.
          </>
        }
      />
    </>
  );
};

export default AppointmentCard;
