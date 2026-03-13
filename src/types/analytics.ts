export type DailyStatsDTO = {
  date: string;
  totalAppointments: number;
  completedAppointments: number;
};

export type ServiceStatsDTO = {
  serviceName: string;
  count: number;
  percentage: number;
};

export type StatusStatsDTO = {
  status: string;
  count: number;
};

export type DashboardStats = {
  totalAppointments: number;
  scheduledCount: number;
  walkInCount: number;
  cancelledCount: number;
  noShowCount: number;
  smsDelivered: number;
  smsFailed: number;
  dailyStats: DailyStatsDTO[];
  serviceStats: ServiceStatsDTO[];
  statusStats: StatusStatsDTO[];
};
