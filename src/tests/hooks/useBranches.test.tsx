import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useCreateBranch, useDeleteBranch, useUpdateBranch } from "@/hooks/useBranches";
import { branchService } from "@/services/branch.service";
import { Q_KEYS } from "@/constants/queryKeys";
import { toast } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";

vi.mock("@/services/branch.service", () => ({
  branchService: {
    createBranch: vi.fn(),
    updateBranch: vi.fn(),
    deleteBranch: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/context/UserContext", () => ({
  useUser: vi.fn(),
}));

const mockRefetchUser = vi.fn();
(useUser as any).mockReturnValue({
  refetchUser: mockRefetchUser,
  selectedBranchId: null,
  setSelectedBranchId: vi.fn(),
});

describe("useBranches Hooks", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("useCreateBranch", () => {
    it("successfully creates a branch, invalidates caches, and refetches user", async () => {
      const mockBranch = { id: "1", name: "Main Branch" };
      (branchService.createBranch as any).mockResolvedValue({
        success: true,
        message: "Branch created successfully",
        data: mockBranch,
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
      const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

      const { result } = renderHook(() => useCreateBranch(), { wrapper });

      result.current.mutate({ name: "Main Branch", address: "123 St" });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(branchService.createBranch).toHaveBeenCalledWith({ name: "Main Branch", address: "123 St" });

      // Check optimistic update
      expect(setQueryDataSpy).toHaveBeenCalledWith([Q_KEYS.BRANCHES], expect.any(Function));

      // Check invalidations
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.STAFFS] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.SERVICES] });

      // Check side effects
      expect(toast.success).toHaveBeenCalledWith("Branch created successfully", expect.any(Object));
      expect(mockRefetchUser).toHaveBeenCalled();
    });

    it("handles error during creation", async () => {
      (branchService.createBranch as any).mockRejectedValue(new Error("Network Error"));

      const { result } = renderHook(() => useCreateBranch(), { wrapper });

      result.current.mutate({ name: "Main Branch", address: "123 St" });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(toast.error).toHaveBeenCalledWith("Failed to create branch", expect.any(Object));
    });
  });

  describe("useUpdateBranch", () => {
    it("successfully updates a branch and invalidates caches", async () => {
      const mockBranch = { id: "1", name: "Updated Branch" };
      (branchService.updateBranch as any).mockResolvedValue({
        success: true,
        message: "Branch updated successfully",
        data: mockBranch,
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
      const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

      const { result } = renderHook(() => useUpdateBranch(), { wrapper });

      result.current.mutate({ id: "1", data: { name: "Updated Branch" } });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(branchService.updateBranch).toHaveBeenCalledWith("1", { name: "Updated Branch" });

      // Check optimistic update
      expect(setQueryDataSpy).toHaveBeenCalledWith([Q_KEYS.BRANCHES], expect.any(Function));

      // Check invalidations
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.STAFFS] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.SERVICES] });

      // Check side effects
      expect(toast.success).toHaveBeenCalledWith("Branch updated successfully", expect.any(Object));
      expect(mockRefetchUser).toHaveBeenCalled();
    });

    it("handles error during update", async () => {
      (branchService.updateBranch as any).mockRejectedValue(new Error("Network Error"));

      const { result } = renderHook(() => useUpdateBranch(), { wrapper });

      result.current.mutate({ id: "1", data: { name: "Updated Branch" } });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(toast.error).toHaveBeenCalledWith("Failed to update branch", expect.any(Object));
    });
  });

  describe("useDeleteBranch", () => {
    it("successfully deletes a branch and invalidates caches", async () => {
      (branchService.deleteBranch as any).mockResolvedValue({
        success: true,
        message: "Branch deleted successfully",
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
      const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

      const { result } = renderHook(() => useDeleteBranch(), { wrapper });

      result.current.mutate("1");

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(branchService.deleteBranch).toHaveBeenCalledWith("1");

      // Check optimistic update
      expect(setQueryDataSpy).toHaveBeenCalledWith([Q_KEYS.BRANCHES], expect.any(Function));

      // Check invalidations
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.STAFFS] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [Q_KEYS.SERVICES] });

      // Check side effects
      expect(toast.success).toHaveBeenCalledWith("Branch deleted successfully", expect.any(Object));
    });

    it("handles error during deletion", async () => {
      (branchService.deleteBranch as any).mockRejectedValue(new Error("Network Error"));

      const { result } = renderHook(() => useDeleteBranch(), { wrapper });

      result.current.mutate("1");

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(toast.error).toHaveBeenCalledWith("Failed to delete branch", expect.any(Object));
    });
  });
});
