export type SmsStatus = "PENDING" | "DELIVERED" | "FAILED";

export type SmsLog = {
  id: string;
  businessId: string;
  appointmentId?: string;
  customerName?: string;
  recipientPhone: string;
  messageBody: string;
  status: SmsStatus;
  errorMessage?: string;
  createdAt: string;
};

export type SmsLogSearchParams = {
  page?: number;
  size?: number;
  branchId?: string;
  startDate?: string;
  endDate?: string;
  status?: SmsStatus;
};

export type SmsBalanceResponse = {
  remainingCredits: number;
  success: boolean;
  errorMessage: string | null;
};

export type ReminderConfigResponse = {
  id: string;
  businessId: string;
  leadTimeMinutes: number;
  messageTemplate: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateReminderConfigRequest = {
  leadTimeMinutes: number;
  messageTemplate: string;
  enabled?: boolean;
};

export type UpdateReminderConfigRequest = {
  leadTimeMinutes?: number;
  messageTemplate?: string;
  enabled?: boolean;
};
