import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, Clock, Tag } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { SavingIndicator } from "@/components/common/SavingIndicator";
import type { ServiceResponse } from "@/types/service";
import { cn } from "@/lib/utils";

type ServiceCardProps = {
  service: ServiceResponse;
  showSaving?: boolean;
  onEdit: (service: ServiceResponse) => void;
  onDelete?: (service: ServiceResponse) => void;
  onToggleActive?: (service: ServiceResponse) => void;
};

const ServiceCard = ({
  service,
  showSaving,
  onEdit,
  onDelete,
  onToggleActive,
}: ServiceCardProps) => {
  return (
    <Card
      className={cn(
        "group relative flex-row items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-all hover:bg-accent/40 hover:shadow-sm",
        showSaving && "opacity-70 grayscale-[0.5]",
      )}
    >
      <div className="flex flex-1 items-center gap-4 min-w-0">
        {onToggleActive && (
          <div className="flex items-center">
            <Switch
              checked={service.isActive}
              onCheckedChange={() => onToggleActive(service)}
              disabled={showSaving}
              className="mr-2"
              aria-label="Toggle active status"
            />
          </div>
        )}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Tag className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-tight truncate">
              {service.name}
            </h3>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {service.durationMinutes} mins
            </div>
            {service.description && (
              <p className="text-[11px] text-muted-foreground truncate max-w-[200px] sm:max-w-md italic">
                • {service.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {showSaving && <SavingIndicator />}
        <div className="text-right hidden sm:block">
          <div className="text-xs font-bold text-primary">
            ₱
            {(service.effectivePrice ?? service.basePrice).toLocaleString(
              "en-PH",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => onEdit(service)}
            disabled={showSaving}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          {onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                  disabled={showSaving}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem
                  onClick={() => onDelete(service)}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer font-medium"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Service
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
