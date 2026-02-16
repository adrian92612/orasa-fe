import { format } from "date-fns";
import type { ActivityLog } from "@/types/activity-log";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CommonPagination from "@/components/common/CommonPagination";

interface ActivityLogListProps {
  logs: ActivityLog[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

const ActivityLogList = ({
  logs,
  isLoading,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}: ActivityLogListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading activity logs...
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
        No activity logs found.
      </div>
    );
  }

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
                    {log.userName || "System"}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs font-normal">
                  {log.action}
                </Badge>
              </CardHeader>
              <CardContent className="py-3 px-4 text-sm">
                <p className="text-foreground/90">{log.description}</p>
                {log.details && (
                  <Accordion
                    type="single"
                    collapsible
                    className="mt-2 w-full border-none"
                  >
                    <AccordionItem value="details" className="border-none">
                      <AccordionTrigger className="py-1 text-xs text-muted-foreground hover:text-primary hover:no-underline justify-start gap-2">
                        View Details
                      </AccordionTrigger>
                      <AccordionContent>
                        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4 overflow-x-auto text-xs text-slate-50 font-mono">
                          {tryFormatJson(log.details)}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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

// Helper to pretty print JSON if applicable, otherwise return raw string
const tryFormatJson = (str: string) => {
  if (!str) return "";
  try {
    // If it's already a JSON object (though type says string, sometimes backend sends object if valid json type in DB)
    if (typeof str === "object") return JSON.stringify(str, null, 2);

    const obj = JSON.parse(str);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return str;
  }
};

export default ActivityLogList;
