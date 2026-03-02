import { Suspense, useState } from "react";
import { subDays, format } from "date-fns";
import { useSuspenseActivityLogs } from "@/hooks/useActivityLogs";
import ActivityLogList from "@/components/features/activity-logs/ActivityLogList";
import ActivityLogFilters from "@/components/features/activity-logs/ActivityLogFilters";
import type { DateRange } from "react-day-picker";
import { useUser } from "@/context/UserContext";
import CommonPagination from "@/components/common/CommonPagination";
import ActivityLogSkeleton from "@/components/features/activity-logs/ActivityLogSkeleton";
import ActivityLogsPageSkeleton from "@/components/features/activity-logs/ActivityLogsPageSkeleton";

import type { ActivityLogSearchParams } from "@/types/activity-log";

const ActivityLogsPageContent = ({
  params,
  onPageChange,
  onPageSizeChange,
}: {
  params: ActivityLogSearchParams & { page: number; size: number };
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: string) => void;
}) => {
  const { data } = useSuspenseActivityLogs(params);

  return (
    <>
      <ActivityLogList logs={data?.content || []} />

      <CommonPagination
        currentPage={params.page}
        totalItems={data?.totalElements || 0}
        pageSize={params.size}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        itemName="logs"
      />
    </>
  );
};

const ActivityLogsPageBody = () => {
  const { selectedBranchId } = useUser();

  useSuspenseActivityLogs({
    page: 1,
    size: 1,
    branchId: (selectedBranchId as string) || undefined,
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [action, setAction] = useState("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });

  const params = {
    page,
    size: pageSize,
    action: action === "ALL" ? undefined : action,
    branchId: selectedBranchId || undefined,
    startDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  };

  const handleActionChange = (newAction: string) => {
    setAction(newAction);
    setPage(1);
  };

  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <ActivityLogFilters
        action={action}
        onActionChange={handleActionChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        isLoading={false}
      />

      <Suspense fallback={<ActivityLogSkeleton />}>
        <ActivityLogsPageContent
          params={params}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(Number(size));
            setPage(1);
          }}
        />
      </Suspense>
    </div>
  );
};

const ActivityLogsPage = () => {
  return (
    <Suspense fallback={<ActivityLogsPageSkeleton />}>
      <ActivityLogsPageBody />
    </Suspense>
  );
};

export default ActivityLogsPage;
