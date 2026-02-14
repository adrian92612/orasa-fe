import { Users, CalendarCheck, CalendarX, MessageSquare } from "lucide-react";

import type { DashboardStats } from "@/types/analytics";
import { StatCard } from "./StatCard";
import { AppointmentsTrendChart } from "./charts/AppointmentsTrendChart";
import { RevenueTrendChart } from "./charts/RevenueTrendChart";
import { PopularServicesChart } from "./charts/PopularServicesChart";
import { StatusDistributionChart } from "./charts/StatusDistributionChart";

interface AnalyticsDashboardProps {
  stats: DashboardStats;
}

export function AnalyticsDashboard({ stats }: AnalyticsDashboardProps) {
  const totalRevenue = stats.dailyStats.reduce(
    (acc, curr) => acc + curr.estimatedRevenue,
    0,
  );

  const scheduledRate =
    stats.totalAppointments > 0
      ? Math.round((stats.scheduledCount / stats.totalAppointments) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          description={`${stats.scheduledCount} scheduled, ${stats.walkInCount} walk-ins`}
          icon={Users}
        />
        <StatCard
          title="Scheduled Rate"
          value={`${scheduledRate}%`}
          description="Appointments booked in advance"
          icon={CalendarCheck}
        />
        <StatCard
          title="No-Show / Cancelled"
          value={stats.cancelledCount + stats.noShowCount}
          description={`${stats.cancelledCount} cancelled, ${stats.noShowCount} no-shows`}
          icon={CalendarX}
        />
        <StatCard
          title="SMS Sent"
          value={stats.smsSent}
          description={
            stats.smsFailed > 0
              ? `${stats.smsFailed} failed messages`
              : "All messages delivered"
          }
          icon={MessageSquare}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <AppointmentsTrendChart data={stats.dailyStats} />
        <RevenueTrendChart
          data={stats.dailyStats}
          totalRevenue={totalRevenue}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <PopularServicesChart data={stats.serviceStats} />
        <StatusDistributionChart
          data={stats.statusStats}
          totalAppointments={stats.totalAppointments}
        />
      </div>
    </div>
  );
}
