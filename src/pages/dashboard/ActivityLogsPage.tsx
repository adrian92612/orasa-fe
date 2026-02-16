import { useState } from "react";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import ActivityLogList from "@/components/features/activity-logs/ActivityLogList";
import ActivityLogFilters from "@/components/features/activity-logs/ActivityLogFilters";

const ActivityLogsPage = () => {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");

  const { data, isLoading } = useActivityLogs({
    page,
    size: 20,
    action,
  });

  const handleActionChange = (newAction: string) => {
    setAction(newAction);
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Activity Logs</h2>
          <p className="text-muted-foreground">
            Monitor system actions and staff activity.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-card rounded-lg border shadow-sm p-6">
        <ActivityLogFilters
          action={action}
          onActionChange={handleActionChange}
          isLoading={isLoading}
        />

        <div className="flex-1 min-h-0">
          <ActivityLogList
            logs={data?.content || []}
            isLoading={isLoading}
            currentPage={page}
            totalPages={data?.totalPages || 1}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityLogsPage;
