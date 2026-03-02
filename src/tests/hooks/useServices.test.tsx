import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import { useCreateService, useUpdateService, useDeleteService } from "@/hooks/useServices";
import { serviceService } from "@/services/service.service";
import { Q_KEYS } from "@/constants/queryKeys";
import { toast } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/services/service.service", () => ({
  serviceService: {
    createService: vi.fn(),
    updateService: vi.fn(),
    deleteService: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useServices Hooks", () => {
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

    // Prime the cache so optimistic updates run
    queryClient.setQueryData([Q_KEYS.SERVICES, { branchId: null }], [{ id: "existing-service" }]);
    queryClient.setQueryData([Q_KEYS.SERVICES, "branch", "branch-1"], [{ serviceId: "existing-service" }]);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("useCreateService", () => {
    it("successfully creates a service and invalidates caches", async () => {
      (serviceService.createService as Mock).mockResolvedValue({
        success: true,
        message: "Service created successfully",
        data: { id: "s1", name: "New Service" },
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
      const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

      const { result } = renderHook(() => useCreateService(), { wrapper });

      result.current.mutate({ name: "New Service", description: "Desc", basePrice: 100, durationMinutes: 30 });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(serviceService.createService).toHaveBeenCalledWith({
        name: "New Service",
        description: "Desc",
        basePrice: 100,
        durationMinutes: 30,
      });

      // Check Optimistic Update
      expect(setQueryDataSpy).toHaveBeenCalledWith([Q_KEYS.SERVICES, { branchId: null }], expect.any(Function));

      // Check Cache Invalidations
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.SERVICES] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.SERVICES, "branch"] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.BRANCHES] });

      expect(toast.success).toHaveBeenCalledWith("Service created successfully");
    });

    it("handles error and rollbacks cache during creation", async () => {
      (serviceService.createService as Mock).mockRejectedValue(new Error("Network Error"));

      const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

      const { result } = renderHook(() => useCreateService(), { wrapper });

      result.current.mutate({ name: "Error Service", description: "", basePrice: 0, durationMinutes: 0 });

      await waitFor(() => expect(result.current.isError).toBe(true));

      // Initial optimistic set AND rollback set should have been called
      expect(setQueryDataSpy.mock.calls.length).toBeGreaterThanOrEqual(2);
      expect(toast.error).toHaveBeenCalledWith("Failed to create service");
    });
  });

  describe("useUpdateService", () => {
    it("successfully updates a service and invalidates caches", async () => {
      (serviceService.updateService as Mock).mockResolvedValue({
        success: true,
        message: "Service updated successfully",
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
      const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

      const { result } = renderHook(() => useUpdateService(), { wrapper });

      result.current.mutate({ id: "s1", data: { name: "Updated Service Name" } });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(serviceService.updateService).toHaveBeenCalledWith("s1", { name: "Updated Service Name" });

      // Check Optimistic Update
      expect(setQueryDataSpy).toHaveBeenCalledWith([Q_KEYS.SERVICES, { branchId: null }], expect.any(Function));

      // Check Cache Invalidations
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.SERVICES] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.SERVICES, "branch"] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.BRANCHES] });

      expect(toast.success).toHaveBeenCalledWith("Service updated successfully");
    });

    it("handles error and rollbacks cache during update", async () => {
      (serviceService.updateService as Mock).mockRejectedValue(new Error("Network Error"));

      const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

      const { result } = renderHook(() => useUpdateService(), { wrapper });

      result.current.mutate({ id: "s1", data: { name: "Error Update Name" } });

      await waitFor(() => expect(result.current.isError).toBe(true));

      // Initial optimistic set AND rollback
      // With branchQueries it might be called more times, but at least 2 is guaranteed for the main services list
      expect(setQueryDataSpy.mock.calls.length).toBeGreaterThanOrEqual(2);
      expect(toast.error).toHaveBeenCalledWith("Failed to update service");
    });
  });

  describe("useDeleteService", () => {
    it("successfully deletes a service and invalidates caches", async () => {
      (serviceService.deleteService as Mock).mockResolvedValue({
        success: true,
        message: "Service deleted successfully",
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
      const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

      const { result } = renderHook(() => useDeleteService(), { wrapper });

      result.current.mutate("s1");

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(serviceService.deleteService).toHaveBeenCalledWith("s1");

      expect(setQueryDataSpy).toHaveBeenCalledWith([Q_KEYS.SERVICES, { branchId: null }], expect.any(Function));

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.SERVICES] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.BRANCHES] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.SERVICES, "branch"] });

      expect(toast.success).toHaveBeenCalledWith("Service deleted successfully");
    });
  });
});
