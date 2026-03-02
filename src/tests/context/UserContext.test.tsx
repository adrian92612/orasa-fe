import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import { UserProvider, useUser } from "@/context/UserContext";
import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/lib/api-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock API Client
vi.mock("@/lib/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("UserContext", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    // Recreate queryClient to clear cache between tests
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <React.Suspense fallback={<div>Loading...</div>}>
        <UserProvider>{children}</UserProvider>
      </React.Suspense>
    </QueryClientProvider>
  );

  it("fetches and provides user data successfully", async () => {
    const mockUser = {
      userId: "1",
      username: "testuser",
      role: "OWNER",
      businessId: "biz-1",
      businessName: "Test Biz",
    };

    (apiClient.get as Mock).mockResolvedValue({
      success: true,
      data: mockUser,
    });

    const { result } = renderHook(() => useUser(), { wrapper });

    // Wait for Suspense query to resolve
    await waitFor(() => expect(result.current.user).toEqual(mockUser));
  });

  it("provides null user if fetching fails", async () => {
    (apiClient.get as Mock).mockRejectedValue(new Error("Unauthorized"));

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => expect(result.current.user).toBeNull());
  });

  it("manages selectedBranchId state", async () => {
    (apiClient.get as Mock).mockResolvedValue({
      success: true,
      data: { userId: "1", role: "STAFF" },
    });

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => expect(result.current.selectedBranchId).toBeNull());

    act(() => {
      result.current.setSelectedBranchId("branch-1");
    });

    expect(result.current.selectedBranchId).toBe("branch-1");
  });

  it("handles logout successfully", async () => {
    (apiClient.get as Mock).mockResolvedValue({
      success: true,
      data: { userId: "1", role: "OWNER" },
    });
    (apiClient.post as Mock).mockResolvedValue({ success: true });

    const sessionStorageRemoveSpy = vi.spyOn(Storage.prototype, "removeItem");

    const { result } = renderHook(() => useUser(), { wrapper });

    await waitFor(() => expect(result.current.user).toBeDefined());

    await result.current.logout();

    expect(apiClient.post).toHaveBeenCalledWith(API_ROUTES.AUTH.LOGOUT, {});
    expect(sessionStorageRemoveSpy).toHaveBeenCalledWith("subscription-banner-dismissed");
    expect(window.location.href).toBe("/login");
  });

  it("throws error if used outside of UserProvider", () => {
    // Suppress console.error for missing context intentionally
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useUser())).toThrow("useUser must be used within a UserProvider");

    consoleError.mockRestore();
  });
});
