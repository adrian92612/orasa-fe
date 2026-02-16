import { format } from "date-fns";
import type { SmsLog } from "@/types/sms";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import CommonPagination from "@/components/common/CommonPagination";

interface SmsLogListProps {
  logs: SmsLog[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

const SmsLogList = ({
  logs,
  isLoading,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}: SmsLogListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading SMS logs...
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
        No SMS logs found.
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "SENT":
      case "DELIVERED":
        return "success"; // Assuming you have a success variant or use default/secondary
      case "FAILED":
        return "destructive";
      case "PENDING":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <ScrollArea className="flex-1 pr-4 min-h-[400px]">
        <div className="space-y-3">
          {logs.map((log) => (
            <Card
              key={log.id}
              className="overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary transition-colors"
            >
              <CardHeader className="py-3 px-4 bg-muted/30 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    {format(new Date(log.createdAt), "MMM d, yyyy h:mm a")}
                  </span>
                  <span className="font-semibold text-sm">
                    {log.recipientPhone}
                    {log.customerName && (
                      <span className="text-muted-foreground font-normal ml-1">
                        ({log.customerName})
                      </span>
                    )}
                  </span>
                </div>
                <Badge
                  variant={getStatusVariant(log.status) as any}
                  className="text-xs font-normal"
                >
                  {log.status}
                </Badge>
              </CardHeader>
              <CardContent className="py-3 px-4 text-sm">
                <p className="text-foreground/90 font-mono text-xs bg-muted/50 p-2 rounded border">
                  {log.messageBody}
                </p>
                {log.errorMessage && (
                  <p className="mt-2 text-xs text-destructive font-medium">
                    Error: {log.errorMessage}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {totalPages > 1 && (
        <div className="flex justify-center pt-2 border-t mt-4">
          <CommonPagination
            currentPage={currentPage}
            totalItems={totalElements}
            pageSize={20}
            onPageChange={onPageChange}
            onPageSizeChange={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default SmsLogList;
