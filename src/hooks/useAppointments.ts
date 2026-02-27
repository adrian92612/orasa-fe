import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { appointmentService } from "@/services/appointment.service";
import { Q_KEYS } from "@/constants/queryKeys";

import type {
  AppointmentResponse,
  AppointmentStatus,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from "@/types/appointment";

export const useAppointments = (
  branchId: string | null,
  businessId: string | null,
  page = 0,
  size = 20,
  search = "",
  startDate?: string,
  endDate?: string,
  status?: string | null,
  type?: string | null,
) => {
  return useQuery({
    queryKey: [
      Q_KEYS.APPOINTMENTS,
      branchId || Q_KEYS.ALL,
      businessId,
      page,
      size,
      search,
      startDate,
      endDate,
      status,
      type,
    ],
    queryFn: () => {
      // ... same logic
      if (search || startDate || endDate || status || type) {
        if (branchId) {
          return appointmentService.searchAppointments(
            branchId,
            search,
            startDate || "",
            endDate || "",
            status,
            type,
            page,
            size,
          );
        }
        return appointmentService.searchAppointmentsByBusiness(
          businessId!,
          search,
          startDate || "",
          endDate || "",
          status,
          type,
          page,
          size,
        );
      }

      if (branchId) {
        return appointmentService.getAppointmentsByBranch(branchId, page, size);
      }

      if (businessId) {
        return appointmentService.getAppointmentsByBusiness(
          businessId,
          page,
          size,
        );
      }

      return Promise.reject(new Error("No branch or business ID provided"));
    },
    enabled: !!(branchId || businessId),
  });
};

export const useSuspenseAppointments = (
  branchId: string | null,
  businessId: string | null,
  page = 0,
  size = 20,
  search = "",
  startDate?: string,
  endDate?: string,
  status?: string | null,
  type?: string | null,
) => {
  return useSuspenseQuery({
    queryKey: [
      Q_KEYS.APPOINTMENTS,
      branchId || Q_KEYS.ALL,
      businessId,
      page,
      size,
      search,
      startDate,
      endDate,
      status,
      type,
    ],
    queryFn: () => {
      if (search || startDate || endDate || status || type) {
        if (branchId) {
          return appointmentService.searchAppointments(
            branchId,
            search,
            startDate || "",
            endDate || "",
            status,
            type,
            page,
            size,
          );
        }
        return appointmentService.searchAppointmentsByBusiness(
          businessId!,
          search,
          startDate || "",
          endDate || "",
          status,
          type,
          page,
          size,
        );
      }

      if (branchId) {
        return appointmentService.getAppointmentsByBranch(branchId, page, size);
      }

      if (businessId) {
        return appointmentService.getAppointmentsByBusiness(
          businessId,
          page,
          size,
        );
      }

      return Promise.reject(new Error("No branch or business ID provided"));
    },
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [Q_KEYS.APPOINTMENTS, Q_KEYS.CREATE],
    mutationFn: (data: CreateAppointmentRequest) =>
      appointmentService.createAppointment(data),
    onMutate: async (newAppointment) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: [Q_KEYS.APPOINTMENTS] });

      // Snapshot the previous value
      const previousAppointments = queryClient.getQueriesData({
        queryKey: [Q_KEYS.APPOINTMENTS],
      });

      // Optimistically update to the new value
      queryClient.setQueriesData<{
        content: AppointmentResponse[];
        totalElements: number;
      }>({ queryKey: [Q_KEYS.APPOINTMENTS] }, (old) => {
        if (!old) return old;

        const optimisticItem: AppointmentResponse = {
          id: `temp-${Date.now()}`,
          businessId: newAppointment.businessId,
          branchId: newAppointment.branchId,
          branchName: "...", // Unknown here, will be updated on refetch
          type: newAppointment.isWalkin ? "WALK_IN" : "SCHEDULED",
          customerName: newAppointment.customerName,
          customerPhone: newAppointment.customerPhone,
          startDateTime: newAppointment.startDateTime,
          endDateTime:
            newAppointment.endDateTime || newAppointment.startDateTime,
          status: "PENDING",
          notes: newAppointment.notes,
          serviceId: newAppointment.serviceId,
          serviceName: "...", // Unknown here
          selectedReminderIds: newAppointment.selectedReminderIds || [],
          additionalReminderMinutes: newAppointment.additionalReminderMinutes,
          additionalReminderTemplate: newAppointment.additionalReminderTemplate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return {
          ...old,
          content: [optimisticItem, ...old.content],
          totalElements: old.totalElements + 1,
        };
      });

      // Return a context object with the snapshotted value
      return { previousAppointments };
    },
    onError: (error: Error, _newAppointment, context) => {
      if (context?.previousAppointments) {
        context.previousAppointments.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to create appointment", {
        description: error.message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.APPOINTMENTS] });
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.APPOINTMENT_COUNTS] });
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.ANALYTICS] });
    },
    onSuccess: (response) => {
      toast.success(response.message || "Appointment created successfully");
    },
  });
};

export const useUpdateAppointment = () => {
  // ... existing code
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [Q_KEYS.APPOINTMENTS, Q_KEYS.UPDATE],
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAppointmentRequest;
    }) => appointmentService.updateAppointment(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [Q_KEYS.APPOINTMENTS] });

      const previousAppointments = queryClient.getQueriesData({
        queryKey: [Q_KEYS.APPOINTMENTS],
      });

      queryClient.setQueriesData<{ content: AppointmentResponse[] }>(
        { queryKey: [Q_KEYS.APPOINTMENTS] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            content: old.content.map((appointment) =>
              appointment.id === id ? { ...appointment, ...data } : appointment,
            ),
          };
        },
      );

      return { previousAppointments };
    },
    onError: (_err, _newAppointment, context) => {
      if (context?.previousAppointments) {
        context.previousAppointments.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to update appointment");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.APPOINTMENTS] });
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.APPOINTMENT_COUNTS] });
    },
    onSuccess: (response) => {
      toast.success(response.message || "Appointment updated successfully");
    },
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [Q_KEYS.APPOINTMENTS, Q_KEYS.UPDATE_STATUS],
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      appointmentService.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: [Q_KEYS.APPOINTMENTS] });
      const previousAppointments = queryClient.getQueriesData({
        queryKey: [Q_KEYS.APPOINTMENTS],
      });

      queryClient.setQueriesData<{ content: AppointmentResponse[] }>(
        { queryKey: [Q_KEYS.APPOINTMENTS] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            content: old.content.map((appointment) =>
              appointment.id === id ? { ...appointment, status } : appointment,
            ),
          };
        },
      );

      return { previousAppointments };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousAppointments) {
        context.previousAppointments.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to update appointment status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.APPOINTMENTS] });
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.APPOINTMENT_COUNTS] });
    },
    onSuccess: (response) => {
      toast.success(
        response.message || "Appointment status updated successfully",
      );
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [Q_KEYS.APPOINTMENTS, Q_KEYS.DELETE],
    mutationFn: (id: string) => appointmentService.deleteAppointment(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [Q_KEYS.APPOINTMENTS] });
      const previousAppointments = queryClient.getQueriesData({
        queryKey: [Q_KEYS.APPOINTMENTS],
      });

      queryClient.setQueriesData<{
        content: AppointmentResponse[];
        totalElements: number;
      }>({ queryKey: [Q_KEYS.APPOINTMENTS] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          content: old.content.filter((a) => a.id !== id),
          totalElements: old.totalElements - 1,
        };
      });

      return { previousAppointments };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousAppointments) {
        context.previousAppointments.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to delete appointment");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.APPOINTMENTS] });
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.APPOINTMENT_COUNTS] });
    },
    onSuccess: (response) => {
      toast.success(response.message || "Appointment deleted successfully");
    },
  });
};

export const useAppointmentCounts = (
  branchId: string | null,
  businessId: string | null,
) => {
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");

  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);
  const upcomingStartStr = format(tomorrow, "yyyy-MM-dd");
  const upcomingEndStr = format(nextWeek, "yyyy-MM-dd");

  const { data: todayData, isLoading: isLoadingToday } = useQuery({
    queryKey: [
      Q_KEYS.APPOINTMENT_COUNTS,
      branchId || Q_KEYS.ALL,
      businessId,
      Q_KEYS.TODAY,
    ],
    queryFn: () => {
      if (branchId) {
        return appointmentService.searchAppointments(
          branchId,
          "",
          todayStr,
          todayStr,
          null,
          null,
          0,
          1,
        );
      }
      return appointmentService.searchAppointmentsByBusiness(
        businessId!,
        "",
        todayStr,
        todayStr,
        null,
        null,
        0,
        1,
      );
    },
    enabled: !!(branchId || businessId),
  });

  const { data: upcomingData, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: [
      Q_KEYS.APPOINTMENT_COUNTS,
      branchId || Q_KEYS.ALL,
      businessId,
      Q_KEYS.UPCOMING,
    ],
    queryFn: () => {
      if (branchId) {
        return appointmentService.searchAppointments(
          branchId,
          "",
          upcomingStartStr,
          upcomingEndStr,
          null,
          null,
          0,
          1,
        );
      }
      return appointmentService.searchAppointmentsByBusiness(
        businessId!,
        "",
        upcomingStartStr,
        upcomingEndStr,
        null,
        null,
        0,
        1,
      );
    },
    enabled: !!(branchId || businessId),
  });

  return {
    todayCount: todayData?.totalElements || 0,
    upcomingCount: upcomingData?.totalElements || 0,
    isLoading: isLoadingToday || isLoadingUpcoming,
  };
};

export const useSuspenseAppointmentCounts = (
  branchId: string | null,
  businessId: string | null,
) => {
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");

  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);
  const upcomingStartStr = format(tomorrow, "yyyy-MM-dd");
  const upcomingEndStr = format(nextWeek, "yyyy-MM-dd");

  const { data: todayData } = useSuspenseQuery({
    queryKey: [
      Q_KEYS.APPOINTMENT_COUNTS,
      branchId || Q_KEYS.ALL,
      businessId,
      Q_KEYS.TODAY,
    ],
    queryFn: () => {
      if (branchId) {
        return appointmentService.searchAppointments(
          branchId,
          "",
          todayStr,
          todayStr,
          null,
          null,
          0,
          1,
        );
      }
      return appointmentService.searchAppointmentsByBusiness(
        businessId!,
        "",
        todayStr,
        todayStr,
        null,
        null,
        0,
        1,
      );
    },
  });

  const { data: upcomingData } = useSuspenseQuery({
    queryKey: [
      Q_KEYS.APPOINTMENT_COUNTS,
      branchId || Q_KEYS.ALL,
      businessId,
      Q_KEYS.UPCOMING,
    ],
    queryFn: () => {
      if (branchId) {
        return appointmentService.searchAppointments(
          branchId,
          "",
          upcomingStartStr,
          upcomingEndStr,
          null,
          null,
          0,
          1,
        );
      }
      return appointmentService.searchAppointmentsByBusiness(
        businessId!,
        "",
        upcomingStartStr,
        upcomingEndStr,
        null,
        null,
        0,
        1,
      );
    },
  });

  return {
    todayCount: todayData.totalElements,
    upcomingCount: upcomingData.totalElements,
  };
};
