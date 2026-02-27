export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "NO_SHOW"
  | "COMPLETED";

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
  serviceId?: string;
  serviceName?: string;
  serviceDeleted?: boolean;
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
  serviceId?: string;
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
  serviceId?: string;
  selectedReminderIds?: string[];
  notes?: string;
  additionalReminderMinutes?: number;
  additionalReminderTemplate?: string;
  isWalkin?: boolean;
};
