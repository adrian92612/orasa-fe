import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import {
  useCreateAppointment,
  useUpdateAppointment,
  useUpdateAppointmentStatus,
  useDeleteAppointment,
} from "@/hooks/useAppointments";
import { appointmentService } from "@/services/appointment.service";
import { Q_KEYS } from "@/constants/queryKeys";
import { toast } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/services/appointment.service", () => ({
  appointmentService: {
    createAppointment: vi.fn(),
    updateAppointment: vi.fn(),
    updateStatus: vi.fn(),
    deleteAppointment: vi.fn(),
    getAppointmentsByBranch: vi.fn(),
    searchAppointments: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useAppointments Hooks", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    queryClient.setQueryData([Q_KEYS.APPOINTMENTS], {
      content: [{ id: "appt-1", status: "PENDING" }],
      totalElements: 1,
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("useCreateAppointment", () => {
    it("successfully creates an appointment and invalidates caches", async () => {
      (appointmentService.createAppointment as Mock).mockResolvedValue({
        success: true,
        message: "Appointment created successfully",
        data: { id: "new-appt" },
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
      const setQueriesDataSpy = vi.spyOn(queryClient, "setQueriesData");

      const { result } = renderHook(() => useCreateAppointment(), { wrapper });

      result.current.mutate({
        businessId: "biz-1",
        branchId: "branch-1",
        isWalkin: true,
        customerName: "John Doe",
        customerPhone: "1234567890",
        startDateTime: "2024-01-01T10:00:00",
        serviceId: "srv-1",
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(appointmentService.createAppointment).toHaveBeenCalled();

      // Check Optimistic Update
      expect(setQueriesDataSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.APPOINTMENTS] }, expect.any(Function));

      // Check Cache Invalidations
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.APPOINTMENTS] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.APPOINTMENT_COUNTS] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.ANALYTICS] });

      expect(toast.success).toHaveBeenCalledWith("Appointment created successfully");
    });

    it("handles error and rollbacks cache during creation", async () => {
      (appointmentService.createAppointment as Mock).mockRejectedValue(new Error("Network Error"));

      const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

      const { result } = renderHook(() => useCreateAppointment(), { wrapper });

      result.current.mutate({
        businessId: "biz-1",
        branchId: "branch-1",
        isWalkin: true,
        customerName: "Error Test",
        customerPhone: "1234567890",
        startDateTime: "2024-01-01T10:00:00",
        serviceId: "srv-1",
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      // Assert rollback happened (setQueryData called via context foreach)
      expect(setQueryDataSpy).toHaveBeenCalledWith([Q_KEYS.APPOINTMENTS], expect.any(Object));
      expect(toast.error).toHaveBeenCalledWith("Failed to create appointment", expect.any(Object));
    });
  });

  describe("useUpdateAppointment", () => {
    it("successfully updates an appointment and invalidates caches", async () => {
      (appointmentService.updateAppointment as Mock).mockResolvedValue({
        success: true,
        message: "Appointment updated successfully",
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
      const setQueriesDataSpy = vi.spyOn(queryClient, "setQueriesData");

      const { result } = renderHook(() => useUpdateAppointment(), { wrapper });

      result.current.mutate({
        id: "appt-1",
        data: { customerName: "Updated Name" },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(appointmentService.updateAppointment).toHaveBeenCalledWith("appt-1", {
        customerName: "Updated Name",
      });

      // Check Optimistic Update
      expect(setQueriesDataSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.APPOINTMENTS] }, expect.any(Function));

      // Check Cache Invalidations
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.APPOINTMENTS] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.APPOINTMENT_COUNTS] });

      expect(toast.success).toHaveBeenCalledWith("Appointment updated successfully");
    });

    it("handles error and rollbacks cache during update", async () => {
      (appointmentService.updateAppointment as Mock).mockRejectedValue(new Error("Network Error"));

      const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

      const { result } = renderHook(() => useUpdateAppointment(), { wrapper });

      result.current.mutate({
        id: "appt-1",
        data: { customerName: "Error Test" },
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      // Assert rollback happened (setQueryData called via context foreach)
      expect(setQueryDataSpy).toHaveBeenCalledWith([Q_KEYS.APPOINTMENTS], expect.any(Object));
      expect(toast.error).toHaveBeenCalledWith("Failed to update appointment");
    });
  });

  describe("useUpdateAppointmentStatus", () => {
    it("successfully updates an appointment status", async () => {
      (appointmentService.updateStatus as Mock).mockResolvedValue({
        success: true,
        message: "Appointment status updated successfully",
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
      const setQueriesDataSpy = vi.spyOn(queryClient, "setQueriesData");

      const { result } = renderHook(() => useUpdateAppointmentStatus(), { wrapper });

      result.current.mutate({ id: "appt-1", status: "COMPLETED" });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(appointmentService.updateStatus).toHaveBeenCalledWith("appt-1", "COMPLETED");

      // Check Optimistic Update
      expect(setQueriesDataSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.APPOINTMENTS] }, expect.any(Function));

      // Check Cache Invalidations
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.APPOINTMENTS] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.APPOINTMENT_COUNTS] });

      expect(toast.success).toHaveBeenCalledWith("Appointment status updated successfully");
    });
  });

  describe("useDeleteAppointment", () => {
    it("successfully soft-deletes an appointment", async () => {
      (appointmentService.deleteAppointment as Mock).mockResolvedValue({
        success: true,
        message: "Appointment deleted successfully",
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
      const setQueriesDataSpy = vi.spyOn(queryClient, "setQueriesData");

      const { result } = renderHook(() => useDeleteAppointment(), { wrapper });

      result.current.mutate("appt-1");

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(appointmentService.deleteAppointment).toHaveBeenCalledWith("appt-1");

      expect(setQueriesDataSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.APPOINTMENTS] }, expect.any(Function));

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.APPOINTMENTS] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.APPOINTMENT_COUNTS] });

      expect(toast.success).toHaveBeenCalledWith("Appointment deleted successfully");
    });
  });
});
