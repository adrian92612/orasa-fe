import { Suspense, useState } from "react";
import { subDays, format } from "date-fns";
import { useSuspenseSmsLogs } from "@/hooks/useSmsLogs";
import SmsLogList from "@/components/features/sms/SmsLogList";
import SmsLogFilters from "@/components/features/sms/SmsLogFilters";
import type { DateRange } from "react-day-picker";
import type { SmsStatus } from "@/types/sms";
import { useUser } from "@/context/UserContext";
import CommonPagination from "@/components/common/CommonPagination";
import SmsLogSkeleton from "@/components/features/sms/SmsLogSkeleton";
import SmsLogsPageSkeleton from "@/components/features/sms/SmsLogsPageSkeleton";

const SmsLogsPageContent = ({
  params,
  onPageChange,
  onPageSizeChange,
}: {
  params: any;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: string) => void;
}) => {
  const { data } = useSuspenseSmsLogs(params);

  return (
    <>
      <SmsLogList logs={data?.content || []} />

      <CommonPagination
        currentPage={params.page}
        totalItems={data?.totalElements || 0}
        pageSize={params.size}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        itemName="messages"
      />
    </>
  );
};

const SmsLogsPageBody = () => {
  const { selectedBranchId } = useUser();

  // Warm-up query to trigger page-level skeleton on initial load or branch change
  useSuspenseSmsLogs({
    page: 1,
    size: 1,
    branchId: selectedBranchId || undefined,
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [status, setStatus] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const params = {
    page,
    size: pageSize,
    branchId: selectedBranchId || undefined,
    status: status === "ALL" ? undefined : (status as SmsStatus),
    startDate: dateRange?.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : undefined,
    endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <SmsLogFilters
        status={status}
        onStatusChange={handleStatusChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        isLoading={false}
      />

      <Suspense fallback={<SmsLogSkeleton />}>
        <SmsLogsPageContent
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

const SmsLogsPage = () => {
  return (
    <Suspense fallback={<SmsLogsPageSkeleton />}>
      <SmsLogsPageBody />
    </Suspense>
  );
};

export default SmsLogsPage;
