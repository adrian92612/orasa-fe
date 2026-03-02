import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { type StaffResponse } from "@/types/staff";
import { type ServiceResponse } from "@/types/service";
import BranchDialog from "@/components/features/branches/BranchDialog";
import { useCreateBranch, useUpdateBranch, useDeleteBranch } from "@/hooks/useBranches";
import { useStaff } from "@/hooks/useStaff";

// Mock hooks
vi.mock("@/hooks/useBranches", () => ({
  useCreateBranch: vi.fn(),
  useUpdateBranch: vi.fn(),
  useDeleteBranch: vi.fn(),
}));

vi.mock("@/hooks/useStaff", () => ({
  useStaff: vi.fn(),
}));

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: ResizeObserver,
});

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

const mockStaffList = [
  { id: "staff-1", username: "Staff One", role: "STAFF" } as unknown,
  { id: "staff-2", username: "Staff Two", role: "STAFF" } as unknown,
];

const mockServiceList = [
  { id: "srv-1", name: "Service One", basePrice: 100, durationMinutes: 30 } as unknown,
  { id: "srv-2", name: "Service Two", basePrice: 200, durationMinutes: 60 } as unknown,
];

describe("BranchDialog", () => {
  const onOpenChangeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCreateBranch).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useCreateBranch>);

    vi.mocked(useUpdateBranch).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateBranch>);

    vi.mocked(useDeleteBranch).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteBranch>);

    vi.mocked(useStaff).mockReturnValue({
      data: mockStaffList as unknown as ReturnType<typeof useStaff>["data"],
      isLoading: false,
    } as unknown as ReturnType<typeof useStaff>);
  });

  const renderDialog = (props = {}) => {
    return render(
      <BranchDialog
        open={true}
        onOpenChange={onOpenChangeMock}
        staffList={mockStaffList as unknown as StaffResponse[]}
        serviceList={mockServiceList as unknown as ServiceResponse[]}
        {...props}
      />,
    );
  };

  it("renders correctly in create mode", () => {
    renderDialog();

    expect(screen.getByText("Add New Branch")).toBeInTheDocument();
    expect(screen.getByLabelText(/Branch Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Branch" })).toBeInTheDocument();
  });

  it("shows validation error for empty branch name", async () => {
    renderDialog();

    const submitBtn = screen.getByRole("button", { name: "Create Branch" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Branch name is required")).toBeInTheDocument();
    });
  });

  it("calls createMutation when form is valid", async () => {
    const mockCreate = vi.fn();
    vi.mocked(useCreateBranch).mockReturnValue({
      mutate: mockCreate,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateBranch>);

    renderDialog();

    await userEvent.type(screen.getByLabelText(/Branch Name/i), "Test Branch");
    await userEvent.type(screen.getByLabelText(/Address/i), "123 Test St.");
    // Wait for validation to pass, phone is optional but let's test a valid one
    await userEvent.type(screen.getByLabelText(/Phone Number/i), "09123456789");

    const submitBtn = screen.getByRole("button", { name: "Create Branch" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        {
          name: "Test Branch",
          address: "123 Test St.",
          phoneNumber: "09123456789",
          staffIds: [],
          // By default, it selects all service IDs on create
          serviceIds: ["srv-1", "srv-2"],
        },
        expect.any(Object),
      );
    });
  });

  it("renders correctly in edit mode and populates data", () => {
    const branchToEdit = {
      id: "branch-1",
      name: "Existing Branch",
      address: "456 Exist Ave",
      phoneNumber: "09987654321",
      staffIds: ["staff-1"],
      activeServiceIds: ["srv-1"],
      businessId: "biz-1",
    };

    renderDialog({ branchToEdit });

    expect(screen.getByText("Edit Branch")).toBeInTheDocument();
    expect(screen.getByLabelText(/Branch Name/i)).toHaveValue("Existing Branch");
    expect(screen.getByLabelText(/Address/i)).toHaveValue("456 Exist Ave");
    expect(screen.getByLabelText(/Phone Number/i)).toHaveValue("09987654321");
    // Button is disabled when form is unchanged
    expect(screen.getByRole("button", { name: "Save Changes" })).toBeDisabled();
  });

  it("enables save button and calls updateMutation when changed", async () => {
    const mockUpdate = vi.fn();
    vi.mocked(useUpdateBranch).mockReturnValue({
      mutate: mockUpdate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateBranch>);

    const branchToEdit = {
      id: "branch-1",
      name: "Existing Branch",
      address: "456 Exist Ave",
      phoneNumber: "09987654321",
      staffIds: ["staff-1"],
      activeServiceIds: ["srv-1"],
      businessId: "biz-1",
    };

    renderDialog({ branchToEdit });

    const saveBtn = screen.getByRole("button", { name: "Save Changes" });
    expect(saveBtn).toBeDisabled();

    // Make a change
    const nameInput = screen.getByLabelText(/Branch Name/i);
    await userEvent.type(nameInput, " Updated");

    expect(saveBtn).not.toBeDisabled();

    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(
        {
          id: "branch-1",
          data: {
            name: "Existing Branch Updated", // The updated value
            address: "456 Exist Ave",
            phoneNumber: "09987654321",
            staffIds: ["staff-1"],
            serviceIds: ["srv-1"],
          },
        },
        expect.any(Object),
      );
    });
  });

  it("shows danger zone when editing", () => {
    const branchToEdit = {
      id: "branch-1",
      name: "Existing Branch",
      address: "",
      phoneNumber: "",
      staffIds: [],
      activeServiceIds: [],
      businessId: "biz-1",
    };

    renderDialog({ branchToEdit });

    expect(screen.getByText("Danger Zone")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete Branch" })).toBeInTheDocument();
  });
});
