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
  selectedReminderIds: string[];
  reminderLeadTimeMinutes?: number;
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
  reminderLeadTimeMinutes?: number;
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
  reminderLeadTimeMinutes?: number;
  isWalkin?: boolean;
};
