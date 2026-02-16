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
