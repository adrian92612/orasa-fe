import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import AppointmentDialog from "@/components/features/appointments/AppointmentDialog";

// --- Mock Hooks ---
vi.mock("@/hooks/useServices", () => ({
  useBranchServices: vi.fn(),
}));

vi.mock("@/hooks/useReminders", () => ({
  useReminders: vi.fn(),
}));

vi.mock("@/hooks/useAppointments", () => ({
  useCreateAppointment: vi.fn(),
  useUpdateAppointment: vi.fn(),
}));

vi.mock("@/hooks/useBranches", () => ({
  useBranches: vi.fn(),
}));

vi.mock("@/context/UserContext", () => ({
  useUser: vi.fn(),
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

// Mock simple text elements instead of complex shadcn selects/calendars if needed,
// but let's try rendering them first. If we run into issues, we can mock them.

import { useBranchServices } from "@/hooks/useServices";
import { useReminders } from "@/hooks/useReminders";
import { useCreateAppointment, useUpdateAppointment } from "@/hooks/useAppointments";
import { useBranches } from "@/hooks/useBranches";
import { useUser } from "@/context/UserContext";

describe("AppointmentDialog", () => {
  const onOpenChangeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock returns
    vi.mocked(useBranches).mockReturnValue({
      data: [{ id: "branch-1", name: "Main Branch" }],
      isLoading: false,
    } as unknown as ReturnType<typeof useBranches>);

    vi.mocked(useBranchServices).mockReturnValue({
      data: [
        { id: "srv-1", name: "Service A", durationMinutes: 30, price: 100 },
        { id: "srv-2", name: "Service B", durationMinutes: 60, price: 200 },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useBranchServices>);

    vi.mocked(useReminders).mockReturnValue({
      data: [
        { id: "rem-1", enabled: true, leadTimeMinutes: 60, type: "SCHEDULED" },
        { id: "rem-2", enabled: false, leadTimeMinutes: 1440, type: "SCHEDULED" }, // Disabled
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useReminders>);

    vi.mocked(useCreateAppointment).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useCreateAppointment>);

    vi.mocked(useUpdateAppointment).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateAppointment>);

    vi.mocked(useUser).mockReturnValue({
      user: { role: "OWNER", businessId: "biz-1" },
    } as unknown as ReturnType<typeof useUser>);
  });

  const renderDialog = (props = {}) => {
    return render(<AppointmentDialog open={true} onOpenChange={onOpenChangeMock} branchId="branch-1" {...props} />);
  };

  it("renders scheduled appointment fields by default", () => {
    renderDialog();

    expect(screen.getByText(/Customer Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Walk-in Appointment/i)).toBeInTheDocument();

    // Switch should be off by default (unchecked = scheduled)
    const walkinSwitch = screen.getByRole("switch", { name: /Walk-in Appointment/i });
    expect(walkinSwitch).toHaveAttribute("aria-checked", "false");

    // Reminder settings section should be visible for Scheduled appointments
    expect(screen.getByText(/Reminders/i)).toBeInTheDocument();
  });

  it("hides reminder settings when 'Walk-in' is selected", async () => {
    renderDialog();
    const user = userEvent.setup();

    // Click on 'Walk-in' switch
    const walkinSwitch = screen.getByRole("switch", { name: /Walk-in Appointment/i });
    await user.click(walkinSwitch);

    // After clicking Walk-in, reminders should magically disappear
    expect(screen.queryByText(/Reminders/i)).not.toBeInTheDocument();
  });

  it("shows extra reminder settings when 'Extra Reminder' is checked", async () => {
    renderDialog();
    const user = userEvent.setup();

    // Wait until Reminders label is up
    const addCustomReminderCheckbox = screen.getByLabelText(/Extra Reminder/i);
    expect(screen.queryByText(/Extra Reminder Settings/i)).not.toBeInTheDocument();

    await user.click(addCustomReminderCheckbox);

    // Should now show extra fields
    await waitFor(() => {
      expect(screen.getByText(/Extra Reminder Settings/i)).toBeInTheDocument();
      expect(screen.getByText(/Message Template/i)).toBeInTheDocument();
    });
  });

  it("validates required fields on submit", async () => {
    renderDialog();

    const saveButton = screen.getByRole("button", { name: /Create Appointment/i });
    // Use fireEvent to bypass any radix dialog interaction issues
    fireEvent.click(saveButton);

    // Wait for the validation errors to appear
    await waitFor(() => {
      // Look for the validation error messages
      expect(screen.getByText(/Customer name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Customer phone is required/i)).toBeInTheDocument();
    });
  });
});
