export interface DailyStatsDTO {
  date: string;
  totalAppointments: number;
  completedAppointments: number;
  estimatedRevenue: number;
}

export interface ServiceStatsDTO {
  serviceName: string;
  count: number;
  percentage: number;
}

export interface StatusStatsDTO {
  status: string;
  count: number;
}

export type DashboardStats = {
  totalAppointments: number;
  scheduledCount: number;
  walkInCount: number;
  cancelledCount: number;
  noShowCount: number;
  smsSent: number;
  smsFailed: number;
  dailyStats: DailyStatsDTO[];
  serviceStats: ServiceStatsDTO[];
  statusStats: StatusStatsDTO[];
};
