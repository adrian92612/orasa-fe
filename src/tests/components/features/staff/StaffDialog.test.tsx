import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StaffDialog from "@/components/features/staff/StaffDialog";
import { useBranches } from "@/hooks/useBranches";
import { useCreateStaff, useUpdateStaff } from "@/hooks/useStaff";
import { useUser } from "@/context/UserContext";

// Mock hooks
vi.mock("@/hooks/useBranches");
vi.mock("@/hooks/useStaff");
vi.mock("@/context/UserContext", () => ({
  useUser: vi.fn(),
}));

const mockBranches = [
  { id: "branch-1", name: "Main Branch", address: "Address 1", phoneNumber: "123", businessId: "biz-1" },
  { id: "branch-2", name: "Second Branch", address: "Address 2", phoneNumber: "456", businessId: "biz-1" },
];

const mockUserContext = {
  user: { id: "user-1", email: "owner@test.com", name: "Owner", role: "OWNER", businessId: "biz-1" },
  logout: vi.fn(),
  refetchUser: vi.fn(),
  selectedBranchId: null,
  setSelectedBranchId: vi.fn(),
  isLoading: false,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

describe("StaffDialog", () => {
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useBranches).mockReturnValue({ data: mockBranches, isLoading: false } as unknown as ReturnType<
      typeof useBranches
    >);
    vi.mocked(useCreateStaff).mockReturnValue({ mutate: vi.fn(), isPending: false } as unknown as ReturnType<
      typeof useCreateStaff
    >);
    vi.mocked(useUpdateStaff).mockReturnValue({ mutate: vi.fn(), isPending: false } as unknown as ReturnType<
      typeof useUpdateStaff
    >);
    vi.mocked(useUser).mockReturnValue(mockUserContext as unknown as ReturnType<typeof useUser>);

    // Mock ResizeObserver for Radix UI
    class ResizeObserverMock {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.defineProperty(window, "ResizeObserver", {
      writable: true,
      value: ResizeObserverMock,
    });
  });

  const renderDialog = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <StaffDialog open={true} onOpenChange={mockOnOpenChange} {...props} />
      </QueryClientProvider>,
    );
  };

  it("shows validation errors for empty fields on create", async () => {
    renderDialog();

    fireEvent.click(screen.getByRole("button", { name: /create staff/i }));

    expect(await screen.findByText(/username must be at least 3 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/at least one branch must be assigned/i)).toBeInTheDocument();
  });

  it("validates that passwords must match", async () => {
    renderDialog();

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "staffuser" } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "different" } });

    fireEvent.click(screen.getByLabelText(/main branch/i));

    fireEvent.click(screen.getByRole("button", { name: /create staff/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("calls createMutation when form is valid", async () => {
    const mockCreate = vi.fn();
    vi.mocked(useCreateStaff).mockReturnValue({
      mutate: mockCreate,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateStaff>);

    renderDialog();

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "staff123" } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByLabelText(/main branch/i));

    fireEvent.click(screen.getByRole("button", { name: /create staff/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        username: "staff123",
        temporaryPassword: "password123",
        branchIds: ["branch-1"],
      });
    });
  });

  it("renders in edit mode with existing data", () => {
    const existingStaff = {
      id: "staff-1",
      username: "john_doe",
      role: "STAFF",
      branches: [{ id: "branch-2", name: "Second Branch" }],
      businessId: "biz-1",
      createdAt: "",
      updatedAt: "",
    };

    renderDialog({ staff: existingStaff });

    expect(screen.getByDisplayValue("john_doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john_doe")).toBeDisabled();
    expect(screen.getByLabelText(/second branch/i)).toBeChecked();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });
});
