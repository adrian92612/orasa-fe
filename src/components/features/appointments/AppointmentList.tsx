import { Calendar as CalendarIcon } from "lucide-react";
import AppointmentCard from "@/components/features/appointments/AppointmentCard";
import CommonPagination from "@/components/common/CommonPagination";
import {
  useSuspenseAppointments,
  useDeleteAppointment,
  useUpdateAppointmentStatus,
} from "@/hooks/useAppointments";
import { useMutationState } from "@tanstack/react-query";
import { Q_KEYS } from "@/constants/queryKeys";
import type {
  AppointmentResponse,
  AppointmentStatus,
} from "@/types/appointment";

type AppointmentListProps = {
  branchId: string | null;
  businessId: string | null;
  page: number;
  pageSize: number;
  search: string;
  startDate?: string;
  endDate?: string;
  statusFilter?: string | null;
  typeFilter?: string | null;
  activeTab: string;
  onEdit: (appointment: AppointmentResponse) => void;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (val: string) => void;
};

const AppointmentList = ({
  branchId,
  businessId,
  page,
  pageSize,
  search,
  startDate,
  endDate,
  statusFilter,
  typeFilter,
  activeTab,
  onEdit,
  onPageChange,
  onPageSizeChange,
}: AppointmentListProps) => {
  const deleteMutation = useDeleteAppointment();
  const updateStatusMutation = useUpdateAppointmentStatus();

  const pendingMutations = useMutationState({
    filters: { status: "pending", mutationKey: [Q_KEYS.APPOINTMENTS] },
    select: (mutation) => mutation.state.variables as any,
  });

  const checkIsSaving = (id: string) =>
    pendingMutations.some((vars) => {
      if (typeof vars === "string") return vars === id;
      return vars?.id === id;
    });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
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
  const { data: appointmentPage } = useSuspenseAppointments(
    branchId,
    businessId,
    page,
    pageSize,
    search,
    startDate,
    endDate,
    statusFilter,
    typeFilter,
  );

  if (appointmentPage.content.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl pointer-events-none select-none">
        <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
        <h3 className="text-lg font-medium">No appointments found</h3>
        <p className="text-muted-foreground">
          {activeTab === "today"
            ? "You have no appointments scheduled for today."
            : activeTab === "upcoming"
              ? "You have no appointments scheduled for the next 7 days."
              : "Try adjusting your filters or create a new appointment."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {appointmentPage.content.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            isSaving={checkIsSaving(appointment.id)}
            onEdit={onEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
      <CommonPagination
        totalItems={appointmentPage.totalElements}
        pageSize={pageSize}
        currentPage={page + 1}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        itemName="appointments"
      />
    </>
  );
};

export default AppointmentList;
