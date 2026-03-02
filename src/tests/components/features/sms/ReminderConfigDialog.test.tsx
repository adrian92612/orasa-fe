import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ReminderConfigDialog from "@/components/features/sms/ReminderConfigDialog";
import { useCreateReminderConfig, useUpdateReminderConfig } from "@/hooks/useSms";
import { PREDEFINED_TEMPLATES } from "@/constants/sms";

// Mock hooks
vi.mock("@/hooks/useSms", () => ({
  useCreateReminderConfig: vi.fn(),
  useUpdateReminderConfig: vi.fn(),
}));

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: ResizeObserver,
});

describe("ReminderConfigDialog", () => {
  const onOpenChangeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCreateReminderConfig).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useCreateReminderConfig>);

    vi.mocked(useUpdateReminderConfig).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateReminderConfig>);
  });

  const renderDialog = (props = {}) => {
    return render(<ReminderConfigDialog open={true} onOpenChange={onOpenChangeMock} {...props} />);
  };

  it("renders correctly in add mode with default values", () => {
    renderDialog();

    expect(screen.getByRole("heading", { name: "Add Reminder" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Hours/i)).toHaveValue("1");
    expect(screen.getByLabelText(/Minutes/i)).toHaveValue("0");
    expect(screen.getByLabelText(/Message Template/i)).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: /Active/i })).toBeChecked();
  });

  it("shows error if both hours and minutes are zero", async () => {
    renderDialog();
    const user = userEvent.setup();

    const hoursInput = screen.getByLabelText(/Hours/i);
    const minutesInput = screen.getByLabelText(/Minutes/i);

    await user.clear(hoursInput);
    await user.type(hoursInput, "0");
    await user.clear(minutesInput);
    await user.type(minutesInput, "0");

    fireEvent.click(screen.getByRole("button", { name: /Add Reminder/i }));

    await waitFor(() => {
      expect(screen.getByText(/At least one of hours or minutes must be greater than 0/i)).toBeInTheDocument();
    });
  });

  it("calls createMutation with correct leadTimeMinutes when submitting", async () => {
    const mockCreate = vi.fn();
    vi.mocked(useCreateReminderConfig).mockReturnValue({
      mutate: mockCreate,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateReminderConfig>);

    renderDialog();
    const user = userEvent.setup();

    await user.clear(screen.getByLabelText(/Hours/i));
    await user.type(screen.getByLabelText(/Hours/i), "2");
    await user.clear(screen.getByLabelText(/Minutes/i));
    await user.type(screen.getByLabelText(/Minutes/i), "30");

    fireEvent.click(screen.getByRole("button", { name: /Add Reminder/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        leadTimeMinutes: 150, // 2*60 + 30
        messageTemplate: PREDEFINED_TEMPLATES[0].content,
        enabled: true,
      });
      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
  });

  it("renders correctly in edit mode and updates data", async () => {
    const mockUpdate = vi.fn();
    vi.mocked(useUpdateReminderConfig).mockReturnValue({
      mutate: mockUpdate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateReminderConfig>);

    const config = {
      id: "conf-1",
      businessId: "biz-1",
      leadTimeMinutes: 90, // 1h 30m
      messageTemplate: PREDEFINED_TEMPLATES[1].content,
      enabled: false,
      createdAt: "",
      updatedAt: "",
    };

    renderDialog({ config });

    expect(screen.getByText("Edit Reminder")).toBeInTheDocument();
    expect(screen.getByLabelText(/Hours/i)).toHaveValue("1");
    expect(screen.getByLabelText(/Minutes/i)).toHaveValue("30");
    expect(screen.getByRole("switch", { name: /Active/i })).not.toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        id: "conf-1",
        data: {
          leadTimeMinutes: 90,
          messageTemplate: PREDEFINED_TEMPLATES[1].content,
          enabled: false,
        },
      });
      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
  });
});
