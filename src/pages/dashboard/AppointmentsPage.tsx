import { useState, lazy, Suspense, useMemo } from "react";
import type { KeyboardEvent } from "react";
import { addDays, startOfDay, endOfDay, addMonths, format } from "date-fns";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import {
  useDeleteAppointment,
  useSuspenseAppointmentCounts,
  useUpdateAppointmentStatus,
} from "@/hooks/useAppointments";
import type {
  AppointmentResponse,
  AppointmentStatus,
} from "@/types/appointment";
import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger2,
} from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppointmentsPageSkeleton from "@/components/features/appointments/AppointmentsPageSkeleton";
import AppointmentList from "@/components/features/appointments/AppointmentList";
import { AppointmentListSkeleton } from "@/components/features/appointments/AppointmentListSkeleton";

const AppointmentDialog = lazy(
  () => import("@/components/features/appointments/AppointmentDialog"),
);

const AppointmentsPageContent = () => {
  const { user, selectedBranchId } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse | null>(null);

  // Tabs State
  const [activeTab, setActiveTab] = useState("today");

  // Pagination
  const [page, setPage] = useState(0); // 0-based for API
  const [prevBranchId, setPrevBranchId] = useState(selectedBranchId);

  // Reset page seamlessly when branch changes (Recommended React pattern)
  if (selectedBranchId !== prevBranchId) {
    setPrevBranchId(selectedBranchId);
    setPage(0);
  }
  const [pageSize, setPageSize] = useState(10);

  // "All" Tab Date Range (User selected)
  const [allTabDateRange, setAllTabDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(),
    to: addMonths(new Date(), 1),
  });

  const [search, setSearch] = useState("");

  // Filter State
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  // Computed Date Range based on Active Tab
  const effectiveDateRange = useMemo(() => {
    const today = new Date();
    if (activeTab === "today") {
      return {
        from: startOfDay(today),
        to: endOfDay(today),
      };
    }
    if (activeTab === "upcoming") {
      return {
        from: startOfDay(addDays(today, 1)),
        to: endOfDay(addDays(today, 2)),
      };
    }
    return allTabDateRange;
  }, [activeTab, allTabDateRange]);

  const { todayCount, upcomingCount } = useSuspenseAppointmentCounts(
    selectedBranchId,
    user?.businessId || null,
  );

  const deleteMutation = useDeleteAppointment();
  const updateStatusMutation = useUpdateAppointmentStatus();

  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(0);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCreate = () => {
    setSelectedAppointment(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleStatusChange = (
    appointment: AppointmentResponse,
    newStatus: AppointmentStatus,
  ) => {
    updateStatusMutation.mutate({
      id: appointment.id,
      status: newStatus,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      deleteMutation.mutate(id);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1);
  };

  const handlePageSizeChange = (val: string) => {
    setPageSize(Number(val));
    setPage(0);
  };

  const commonProps = {
    branchId: selectedBranchId,
    businessId: user?.businessId || null,
    page,
    pageSize,
    search: activeTab === "all" ? search : "",
    statusFilter: activeTab === "all" ? statusFilter : null,
    typeFilter: activeTab === "all" ? typeFilter : null,
    activeTab,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onStatusChange: handleStatusChange,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
  };

  const dateProps = {
    startDate: effectiveDateRange.from
      ? format(effectiveDateRange.from, "yyyy-MM-dd")
      : undefined,
    endDate: effectiveDateRange.to
      ? format(effectiveDateRange.to, "yyyy-MM-dd")
      : undefined,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val);
            setPage(0);
          }}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <TabsList className="w-full sm:w-auto justify-start rounded-none bg-transparent p-0">
              <TabsTrigger2 value="today">Today ({todayCount})</TabsTrigger2>
              <TabsTrigger2 value="upcoming">
                Upcoming ({upcomingCount})
              </TabsTrigger2>
              <TabsTrigger2 value="all">All</TabsTrigger2>
            </TabsList>

            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </div>

          <TabsContent value="today">
            <Suspense fallback={<AppointmentListSkeleton />}>
              <AppointmentList {...commonProps} {...dateProps} />
            </Suspense>
          </TabsContent>
          <TabsContent value="upcoming">
            <Suspense fallback={<AppointmentListSkeleton />}>
              <AppointmentList {...commonProps} {...dateProps} />
            </Suspense>
          </TabsContent>

          <TabsContent value="all">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap mb-5">
              <div className="flex flex-col sm:flex-row gap-2 flex-1 flex-wrap">
                <DateRangePicker
                  date={{ from: allTabDateRange.from, to: allTabDateRange.to }}
                  setDate={(range) => {
                    if (range?.from) {
                      setAllTabDateRange({
                        from: range.from,
                        to: range.to || range.from,
                      });
                      setPage(0);
                    }
                  }}
                />

                <Select
                  value={statusFilter}
                  onValueChange={(val) => {
                    setStatusFilter(val);
                    setPage(0);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="NO_SHOW">No Show</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={typeFilter}
                  onValueChange={(val) => {
                    setTypeFilter(val);
                    setPage(0);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="WALK_IN">Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto self-end">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    className="pl-9 w-full"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={handleSearch}
                  className="w-full sm:w-auto"
                >
                  Search
                </Button>
              </div>
            </div>

            <Suspense fallback={<AppointmentListSkeleton />}>
              <AppointmentList {...commonProps} {...dateProps} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>

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
  return (
    <Suspense fallback={<AppointmentsPageSkeleton />}>
      <AppointmentsPageContent />
    </Suspense>
  );
};

export default AppointmentsPage;
