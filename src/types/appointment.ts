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
  endDateTime: string;
  status: AppointmentStatus;
  notes?: string;
  services: AppointmentServiceInfo[];
  selectedReminderIds: string[];
  additionalReminderMinutes?: number;
  additionalReminderTemplate?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAppointmentRequest = {
  businessId: string;
  branchId: string;
  customerName: string;
  customerPhone: string;
  startDateTime: string;
  endDateTime?: string;
  isWalkin: boolean;
  serviceIds: string[];
  selectedReminderIds?: string[];
  notes?: string;
  additionalReminderMinutes?: number;
  additionalReminderTemplate?: string;
};

export type UpdateAppointmentRequest = {
  customerName?: string;
  customerPhone?: string;
  startDateTime?: string;
  endDateTime?: string;
  status?: AppointmentStatus;
  serviceIds?: string[];
  selectedReminderIds?: string[];
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
