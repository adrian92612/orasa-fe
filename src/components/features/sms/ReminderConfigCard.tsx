import { Clock, Pencil, Trash2 } from "lucide-react";

import { useUpdateReminderConfig } from "@/hooks/useSms";

import type { ReminderConfigResponse } from "@/types/sms";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type ReminderConfigCardProps = {
  config: ReminderConfigResponse;
  onEdit: (config: ReminderConfigResponse) => void;
  onDelete: (config: ReminderConfigResponse) => void;
};

const ReminderConfigCard = ({
  config,
  onEdit,
  onDelete,
}: ReminderConfigCardProps) => {
  const updateMutation = useUpdateReminderConfig();

  const handleToggle = (enabled: boolean) => {
    updateMutation.mutate({ id: config.id, data: { enabled } });
  };

  const formatLeadTime = (minutes: number) => {
    if (minutes == null) return "Unknown lead time";
    if (minutes < 60) {
      return minutes === 1 ? "1 minute before" : `${minutes} minutes before`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      if (hours === 1) return "1 hour before";
      if (hours < 24) return `${hours} hours before`;
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      if (remainingHours === 0) {
        return days === 1 ? "1 day before" : `${days} days before`;
      }
      return `${days}d ${remainingHours}h before`;
    }

    return `${hours}h ${remainingMinutes}m before`;
  };

  return (
    <Card
      className={cn("p-4 transition-colors", !config.enabled && "opacity-60")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
            <Clock className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm">
                {formatLeadTime(config.leadTimeMinutes ?? 0)}
              </h3>
              {!config.enabled && (
                <span className="text-xs text-muted-foreground italic">
                  Disabled
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {config.messageTemplate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Switch
            checked={config.enabled}
            onCheckedChange={handleToggle}
            disabled={updateMutation.isPending}
            aria-label={config.enabled ? "Disable reminder" : "Enable reminder"}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => onEdit(config)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
            onClick={() => onDelete(config)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReminderConfigCard;
