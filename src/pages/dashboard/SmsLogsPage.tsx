import { useState } from "react";
import { useSmsLogs } from "@/hooks/useSmsLogs";
import SmsLogList from "@/components/features/sms/SmsLogList";

const SmsLogsPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSmsLogs({
    page,
    size: 20,
  });

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SMS History</h2>
          <p className="text-muted-foreground">
            View all sent SMS messages and their delivery status.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-card rounded-lg border shadow-sm p-6">
        <div className="flex-1 min-h-0">
          <SmsLogList
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

export default SmsLogsPage;
