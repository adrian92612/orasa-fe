import { format } from "date-fns";
import type { SmsLog } from "@/types/sms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface SmsLogListProps {
  logs: SmsLog[];
}

const SmsLogList = ({ logs }: SmsLogListProps) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">No SMS logs found.</div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "success";
      case "FAILED":
        return "destructive";
      case "PENDING":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {logs.map((log) => (
          <Card key={log.id} className="p-3 gap-0 transition-colors hover:bg-accent/50">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-sm truncate">
                  {log.recipientPhone}
                  {log.customerName && (
                    <span className="text-muted-foreground font-normal ml-1">({log.customerName})</span>
                  )}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                  {format(new Date(log.createdAt), "MMM d, h:mm a")}
                </span>
              </div>
              <Badge
                variant={getStatusVariant(log.status) as "success" | "destructive" | "outline" | "secondary"}
                className="text-[10px] px-1.5 py-0 font-normal h-4 shrink-0"
              >
                {log.status}
              </Badge>
            </div>

            <p className="text-xs text-foreground/80 bg-muted/30 p-2 rounded border border-transparent hover:border-muted/50 transition-colors leading-normal italic">
              "{log.messageBody}"
            </p>

            {log.errorMessage && (
              <p className="mt-1.5 text-[10px] text-destructive font-medium bg-destructive/5 px-2 py-0.5 rounded-full inline-block">
                Error: {log.errorMessage}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SmsLogList;
