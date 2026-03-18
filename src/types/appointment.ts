export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "NO_SHOW" | "COMPLETED";

export type AppointmentServiceInfo = {
  id: string;
  name: string;
  deleted: boolean;
};

export type AppointmentResponse = {
  id: string;
  businessId: string;
  branchId: string;
  branchName: string;
  type: "WALK_IN" | "SCHEDULED";
  customerName: string;
  customerPhone: string;
  startDateTime: string;
  status: AppointmentStatus;
  notes?: string;
  services: AppointmentServiceInfo[];
  remindersEnabled: boolean;
  additionalReminderMinutes?: number;
  additionalReminderTemplate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
};

export type CreateAppointmentRequest = {
  businessId: string;
  branchId: string;
  customerName: string;
  customerPhone: string;
  startDateTime: string;
  isWalkin: boolean;
  serviceIds: string[];
  remindersEnabled: boolean;
  notes?: string;
  additionalReminderMinutes?: number;
  additionalReminderTemplate?: string;
};

export type UpdateAppointmentRequest = {
  customerName?: string;
  customerPhone?: string;
  startDateTime?: string;
  status?: AppointmentStatus;
  serviceIds?: string[];
  remindersEnabled?: boolean;
  notes?: string;
  additionalReminderMinutes?: number;
  additionalReminderTemplate?: string;
  isWalkin?: boolean;
};
export type AppointmentSearchParams = {
  branchId: string | null;
  businessId: string | null;
  page?: number;
  size?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string | null;
  type?: string | null;
};
