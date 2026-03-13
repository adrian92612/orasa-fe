import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ServiceDialog from "@/components/features/services/ServiceDialog";
import {
  useCreateService,
  useUpdateService,
} from "@/hooks/useServices";

// Mock hooks
vi.mock("@/hooks/useServices", () => ({
  useCreateService: vi.fn(),
  useUpdateService: vi.fn(),
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


  });

  const renderDialog = (props = {}) => {
    return render(<ServiceDialog open={true} onOpenChange={onOpenChangeMock} {...props} />);
  };

  it("renders correctly in create mode", () => {
    renderDialog();

    expect(screen.getByText("Add New Service")).toBeInTheDocument();
    expect(screen.getByLabelText(/Service Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Service" })).toBeInTheDocument();
  });

  it("shows validation errors for empty required fields on create", async () => {
    renderDialog();

    // Clear default values via userEvent
    const nameInput = screen.getByLabelText(/Service Name/i);

    await userEvent.clear(nameInput);

    const submitBtn = screen.getByRole("button", { name: "Create Service" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
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

    const submitBtn = screen.getByRole("button", { name: "Create Service" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        name: "Haircut",
        description: "Basic haircut",
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
    expect(screen.getByRole("button", { name: "Update Service" })).toBeInTheDocument();
  });


});
