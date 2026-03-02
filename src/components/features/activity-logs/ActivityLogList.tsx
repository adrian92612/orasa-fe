import { format } from "date-fns";
import type { ActivityLog } from "@/types/activity-log";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ActivityLogListProps {
  logs: ActivityLog[];
}

const ActivityLogList = ({ logs }: ActivityLogListProps) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
        No activity logs found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {logs.map((log) => (
          <Card key={log.id} className="p-3 gap-0 transition-colors hover:bg-accent/50">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-sm truncate">{log.userName || "System"}</span>
                <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                  {format(new Date(log.createdAt), "MMM d, h:mm a")}
                </span>
              </div>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal h-4 shrink-0">
                {log.action}
              </Badge>
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed">{log.description}</p>

            {log.details && (
              <Accordion type="single" collapsible className="mt-1 w-full border-none">
                <AccordionItem value="details" className="border-none">
                  <AccordionTrigger className="hover:cursor-pointer py-0.5 text-[10px] text-muted-foreground hover:text-primary hover:no-underline justify-start gap-1 font-normal opacity-70 hover:opacity-100 transition-all">
                    View Details
                  </AccordionTrigger>
                  <AccordionContent>
                    <DetailContent details={log.details} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

interface DetailContentProps {
  details: string;
}

const DetailContent = ({ details }: DetailContentProps) => {
  if (!details) return null;

  let parsed: unknown = null;
  let isParsed = false;

  try {
    parsed = JSON.parse(details);
    isParsed = true;
  } catch {
    // Falls back to raw details display
  }

  if (isParsed) {
    if (Array.isArray(parsed) && parsed.length > 0 && (parsed[0] as { field?: string }).field !== undefined) {
      return (
        <div className="mt-2 overflow-hidden rounded-md border border-muted/50 overflow-x-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-muted/50">
                <th className="px-3 py-1.5 text-left font-medium text-muted-foreground w-1/3">Field</th>
                <th className="px-3 py-1.5 text-left font-medium text-muted-foreground">Before</th>
                <th className="px-3 py-1.5 text-left font-medium text-muted-foreground">After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/30">
              {parsed.map((item: { field: string; before?: string; after?: string }, idx: number) => (
                <tr key={idx} className="hover:bg-muted/10 transition-colors">
                  <td className="px-3 py-1.5 font-medium text-foreground/70">{item.field}</td>
                  <td className="px-3 py-1.5 text-muted-foreground italic">{item.before || "-"}</td>
                  <td className="px-3 py-1.5 text-primary font-medium">{item.after || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <pre className="mt-1.5 w-full rounded-md bg-slate-950 p-3 overflow-x-auto text-[10px] text-slate-50 font-mono leading-tight">
        {JSON.stringify(parsed, null, 2)}
      </pre>
    );
  }

  return (
    <div className="mt-2 p-2 rounded-md bg-muted/20 text-[10px] text-muted-foreground border border-muted/30 whitespace-pre-wrap leading-relaxed">
      {details}
    </div>
  );
};

export default ActivityLogList;
