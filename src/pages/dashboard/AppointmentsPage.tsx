import React, { useState, lazy, Suspense, useEffect, useMemo } from "react";
import { format, addDays, startOfDay, endOfDay, addMonths } from "date-fns";
import { Plus, Search, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import {
  useAppointments,
  useDeleteAppointment,
  useAppointmentCounts,
  useUpdateAppointmentStatus,
} from "@/hooks/useAppointments";
import AppointmentCard from "@/components/features/appointments/AppointmentCard";
import type { AppointmentResponse } from "@/types/appointment";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsTrigger2,
} from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import CommonPagination from "@/components/common/CommonPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AppointmentDialog = lazy(
  () => import("@/components/features/appointments/AppointmentDialog"),
);

const AppointmentsPage = () => {
  const { user, selectedBranchId } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse | null>(null);

  // Tabs State
  const [activeTab, setActiveTab] = useState("today");

  // Pagination
  const [page, setPage] = useState(0); // 0-based for API
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
        to: endOfDay(addDays(today, 2)), // Next 2 days
      };
    }
    return allTabDateRange;
  }, [activeTab, allTabDateRange]);

  // Reset page when filters change or tab changes
  useEffect(() => {
    setPage(0);
  }, [
    search,
    effectiveDateRange,
    selectedBranchId,
    activeTab,
    pageSize,
    statusFilter,
    typeFilter,
  ]);

  const { data: appointmentPage, isLoading } = useAppointments(
    selectedBranchId,
    user?.businessId || null,
    page,
    pageSize,
    activeTab === "all" ? search : "",
    effectiveDateRange.from
      ? format(effectiveDateRange.from, "yyyy-MM-dd")
      : undefined,
    effectiveDateRange.to
      ? format(effectiveDateRange.to, "yyyy-MM-dd")
      : undefined,
    activeTab === "all" ? statusFilter : null,
    activeTab === "all" ? typeFilter : null,
  );

  const { todayCount, upcomingCount } = useAppointmentCounts(
    selectedBranchId,
    user?.businessId || null,
  );

  const deleteMutation = useDeleteAppointment();
  const updateStatusMutation = useUpdateAppointmentStatus();

  // Local state for search input
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
    newStatus: string,
  ) => {
    updateStatusMutation.mutate({
      id: appointment.id,
      status: newStatus as any,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-xl" />
                ))}
              </div>
            ) : appointmentPage?.content.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl pointer-events-none select-none">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">No appointments found</h3>
                <p className="text-muted-foreground">
                  You have no appointments scheduled for today.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {appointmentPage?.content.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
                <CommonPagination
                  totalItems={appointmentPage?.totalElements || 0}
                  pageSize={pageSize}
                  currentPage={page + 1}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  itemName="appointments"
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-xl" />
                ))}
              </div>
            ) : appointmentPage?.content.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl pointer-events-none select-none">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">No appointments found</h3>
                <p className="text-muted-foreground">
                  You have no appointments scheduled for the next 2 days.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {appointmentPage?.content.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
                <CommonPagination
                  totalItems={appointmentPage?.totalElements || 0}
                  pageSize={pageSize}
                  currentPage={page + 1}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  itemName="appointments"
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="all">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-1 gap-2 flex-wrap items-center">
                <DateRangePicker
                  date={{
                    from: allTabDateRange.from,
                    to: allTabDateRange.to,
                  }}
                  setDate={(range) => {
                    if (range?.from) {
                      setAllTabDateRange({
                        from: range.from,
                        to: range.to || range.from,
                      });
                    }
                  }}
                />

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
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

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="WALK_IN">Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    className="pl-9"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <Button variant="secondary" onClick={handleSearch}>
                  Search
                </Button>
              </div>
            </div>
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-xl" />
                ))}
              </div>
            ) : appointmentPage?.content.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl pointer-events-none select-none">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">No appointments found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or create a new appointment.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {appointmentPage?.content.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
                <CommonPagination
                  totalItems={appointmentPage?.totalElements || 0}
                  pageSize={pageSize}
                  currentPage={page + 1}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  itemName="appointments"
                />
              </>
            )}
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

export default AppointmentsPage;
