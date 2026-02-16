export type ActivityLog = {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  businessId: string;
  branchId?: string;
  branchName?: string;
  action: string;
  description: string;
  details?: string;
  createdAt: string;
};

export type ActivityLogSearchParams = {
  page?: number;
  size?: number;
  branchId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
};
