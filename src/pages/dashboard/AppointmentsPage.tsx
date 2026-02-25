import { useState, lazy, Suspense } from "react";
import { format } from "date-fns";
import { useUser } from "@/context/UserContext";
import { useAppointmentCounts } from "@/hooks/useAppointments";
import { useAppointmentsPage } from "@/hooks/useAppointmentsPage";
import { AppointmentFilters } from "@/components/features/appointments/AppointmentFilters";
import { AppointmentTabs } from "@/components/features/appointments/AppointmentTabs";
import AppointmentsPageSkeleton from "@/components/features/appointments/AppointmentsPageSkeleton";
import AppointmentList from "@/components/features/appointments/AppointmentList";
import { AppointmentListSkeleton } from "@/components/features/appointments/AppointmentListSkeleton";
import type { AppointmentResponse } from "@/types/appointment";

const AppointmentDialog = lazy(
  () => import("@/components/features/appointments/AppointmentDialog"),
);

type AppointmentTabContentProps = {
  dateProps: { startDate?: string; endDate?: string };
  commonProps: any;
  filterProps: any;
  includeDateRange?: boolean;
  dateRange?: { from: Date; to: Date };
  onDateRangeChange?: (range: { from: Date; to: Date }) => void;
};

const AppointmentTabContent = ({
  dateProps,
  commonProps,
  filterProps,
  includeDateRange,
  dateRange,
  onDateRangeChange,
}: AppointmentTabContentProps) => (
  <>
    <AppointmentFilters
      {...filterProps}
      includeDateRange={includeDateRange}
      dateRange={dateRange}
      onDateRangeChange={onDateRangeChange}
    />
    <Suspense fallback={<AppointmentListSkeleton />}>
      <AppointmentList {...commonProps} {...dateProps} />
    </Suspense>
  </>
);

const AppointmentsPageContent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse | null>(null);

  const {
    user,
    selectedBranchId,
    activeTab,
    page,
    pageSize,
    statusFilter,
    typeFilter,
    searchInput,
    debouncedSearch,
    allTabDateRange,
    effectiveDateRange,
    setStatusFilter,
    setTypeFilter,
    setSearchInput,
    setAllTabDateRange,
    handleTabChange,
    handlePageChange,
    handlePageSizeChange,
    setPage,
  } = useAppointmentsPage();

  const { todayCount, upcomingCount } = useAppointmentCounts(
    selectedBranchId,
    user?.businessId || null,
  );

  const handleCreate = () => {
    setSelectedAppointment(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const commonProps = {
    branchId: selectedBranchId,
    businessId: user?.businessId || null,
    page,
    pageSize,
    search: debouncedSearch,
    statusFilter: statusFilter === "ALL" ? null : statusFilter,
    typeFilter: typeFilter === "ALL" ? null : typeFilter,
    activeTab,
    onEdit: handleEdit,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
  };

  const range = effectiveDateRange();
  const dateProps = {
    startDate: format(range.from, "yyyy-MM-dd"),
    endDate: format(range.to, "yyyy-MM-dd"),
  };

  const filterProps = {
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    searchInput,
    setSearchInput,
    onPageReset: () => setPage(0),
  };

  return (
    <div className="space-y-6">
      <AppointmentTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isLoadingCounts={false}
        todayCount={todayCount || 0}
        upcomingCount={upcomingCount || 0}
        onCreate={handleCreate}
        todayContent={
          <AppointmentTabContent
            dateProps={dateProps}
            commonProps={commonProps}
            filterProps={filterProps}
          />
        }
        upcomingContent={
          <AppointmentTabContent
            dateProps={dateProps}
            commonProps={commonProps}
            filterProps={filterProps}
          />
        }
        allContent={
          <AppointmentTabContent
            dateProps={dateProps}
            commonProps={commonProps}
            filterProps={filterProps}
            includeDateRange
            dateRange={allTabDateRange}
            onDateRangeChange={setAllTabDateRange}
          />
        }
      />

      <Suspense fallback={null}>
        <AppointmentDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          appointmentToEdit={selectedAppointment}
          branchId={selectedBranchId}
        />
      </Suspense>
    </div>
  );
};

const AppointmentsPage = () => {
  const { user, selectedBranchId } = useUser();
  const { isLoading: isLoadingCounts } = useAppointmentCounts(
    selectedBranchId,
    user?.businessId || null,
  );

  if (isLoadingCounts) {
    return <AppointmentsPageSkeleton />;
  }

  return <AppointmentsPageContent />;
};

export default AppointmentsPage;
