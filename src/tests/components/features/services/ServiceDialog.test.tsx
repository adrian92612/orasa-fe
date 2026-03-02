import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ServiceDialog from "@/components/features/services/ServiceDialog";
import {
  useCreateService,
  useUpdateService,
  useUpdateServiceLink,
  useAssignServiceToBranch,
} from "@/hooks/useServices";

// Mock hooks
vi.mock("@/hooks/useServices", () => ({
  useCreateService: vi.fn(),
  useUpdateService: vi.fn(),
  useUpdateServiceLink: vi.fn(),
  useAssignServiceToBranch: vi.fn(),
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

describe("ServiceDialog", () => {
  const onOpenChangeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCreateService).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useCreateService>);

    vi.mocked(useUpdateService).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateService>);

    vi.mocked(useUpdateServiceLink).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateServiceLink>);

    vi.mocked(useAssignServiceToBranch).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useAssignServiceToBranch>);
  });

  const renderDialog = (props = {}) => {
    return render(<ServiceDialog open={true} onOpenChange={onOpenChangeMock} {...props} />);
  };

  it("renders correctly in create mode", () => {
    renderDialog();

    expect(screen.getByText("Add New Service")).toBeInTheDocument();
    expect(screen.getByLabelText(/Service Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price \(PHP\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Duration \(mins\)/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Service" })).toBeInTheDocument();
  });

  it("shows validation errors for empty required fields on create", async () => {
    renderDialog();

    // Clear default values via userEvent
    const nameInput = screen.getByLabelText(/Service Name/i);
    const durationInput = screen.getByLabelText(/Duration \(mins\)/i);

    await userEvent.clear(nameInput);
    await userEvent.clear(durationInput);

    const submitBtn = screen.getByRole("button", { name: "Create Service" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      // Price is 0 by default, duration is cleared so it's invalid
    });
  });

  it("calls createMutation when form is valid in create mode", async () => {
    const mockCreate = vi.fn();
    vi.mocked(useCreateService).mockReturnValue({
      mutate: mockCreate,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateService>);

    renderDialog();

    await userEvent.type(screen.getByLabelText(/Service Name/i), "Haircut");
    await userEvent.type(screen.getByLabelText(/Description/i), "Basic haircut");

    const priceInput = screen.getByLabelText(/Price \(PHP\)/i);
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, "150");

    const submitBtn = screen.getByRole("button", { name: "Create Service" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        name: "Haircut",
        description: "Basic haircut",
        basePrice: 150,
        durationMinutes: 30, // Default is 30
      });
      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
  });

  it("renders correctly in global edit mode and populates data", () => {
    const serviceToEdit = {
      id: "srv-1",
      name: "Massage",
      basePrice: 500,
      durationMinutes: 60,
      description: "Full body massage",
      isActive: true,
    };

    renderDialog({ serviceToEdit });

    expect(screen.getByText("Edit Service")).toBeInTheDocument();
    expect(screen.getByLabelText(/Service Name/i)).toHaveValue("Massage");
    expect(screen.getByLabelText(/Description/i)).toHaveValue("Full body massage");
    expect(screen.getByLabelText(/Price \(PHP\)/i)).toHaveValue(500);
    expect(screen.getByLabelText(/Duration \(mins\)/i)).toHaveValue(60);
    expect(screen.getByRole("button", { name: "Update Service" })).toBeInTheDocument();
  });

  it("renders correctly in branch mode with overrides disabled correctly", () => {
    const serviceToEdit = {
      id: "srv-1",
      name: "Massage",
      basePrice: 500,
      durationMinutes: 60,
      description: "Full body massage",
      isActive: true,
    };

    renderDialog({ serviceToEdit, branchId: "branch-1" });

    expect(screen.getByText("Edit Service")).toBeInTheDocument();
    expect(screen.getByLabelText(/Service Name/i)).toBeDisabled();
    expect(screen.getByLabelText(/Base Price \(Global\)/i)).toBeDisabled();
    expect(screen.getByLabelText(/Branch Price \(Override\)/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update Service" })).toBeInTheDocument();
  });

  it("calls updateLinkMutation in branch mode if linkId exists", async () => {
    const mockUpdateLink = vi.fn();
    vi.mocked(useUpdateServiceLink).mockReturnValue({
      mutate: mockUpdateLink,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateServiceLink>);

    const serviceToEdit = {
      id: "srv-1",
      linkId: "link-1",
      name: "Massage",
      basePrice: 500,
      durationMinutes: 60,
      description: "",
      isActive: true,
      customPrice: 450,
    };

    renderDialog({ serviceToEdit, branchId: "branch-1" });

    const overrideInput = screen.getByLabelText(/Branch Price \(Override\)/i);
    await userEvent.clear(overrideInput);
    await userEvent.type(overrideInput, "400");

    const submitBtn = screen.getByRole("button", { name: "Update Service" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUpdateLink).toHaveBeenCalledWith({
        branchId: "branch-1",
        linkId: "link-1",
        data: {
          serviceId: "srv-1",
          active: true,
          customPrice: 400,
        },
      });
      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
  });
});
