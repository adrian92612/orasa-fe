import { Users, CheckCircle2, CalendarX, MessageSquare } from "lucide-react";

import type { DashboardStats } from "@/types/analytics";
import { StatCard } from "./StatCard";
import { AppointmentsTrendChart } from "./charts/AppointmentsTrendChart";
import { PopularServicesChart } from "./charts/PopularServicesChart";
import { StatusDistributionChart } from "./charts/StatusDistributionChart";
import { BusiestDaysChart } from "./charts/BusiestDaysChart";
import { WalkInVsScheduledChart } from "./charts/WalkInVsScheduledChart";
import { ServiceNoShowChart } from "./charts/ServiceNoShowChart";

interface AnalyticsDashboardProps {
  stats: DashboardStats;
}

export function AnalyticsDashboard({ stats }: AnalyticsDashboardProps) {
  const completedCount = stats.statusStats.find((s) => s.status === "COMPLETED")?.count || 0;
  const totalAttendedOrNoShow = completedCount + stats.noShowCount;
  const showRate = totalAttendedOrNoShow > 0 ? Math.round((completedCount / totalAttendedOrNoShow) * 100) : 0;

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
          title="Show Rate"
          value={`${showRate}%`}
          description="Percentage of clients who show up"
          icon={CheckCircle2}
        />
        <StatCard
          title="No-Show / Cancelled"
          value={stats.cancelledCount + stats.noShowCount}
          description={`${stats.cancelledCount} cancelled, ${stats.noShowCount} no-shows`}
          icon={CalendarX}
        />
        <StatCard
          title="SMS Delivered"
          value={stats.smsDelivered}
          description={stats.smsFailed > 0 ? `${stats.smsFailed} failed messages` : "All messages delivered"}
          icon={MessageSquare}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <PopularServicesChart data={stats.serviceStats} />
        <StatusDistributionChart data={stats.statusStats} totalAppointments={stats.totalAppointments} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ServiceNoShowChart data={stats.serviceNoShowStats} />
        <WalkInVsScheduledChart scheduledCount={stats.scheduledCount} walkInCount={stats.walkInCount} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <BusiestDaysChart data={stats.busiestDayStats} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <AppointmentsTrendChart data={stats.dailyStats} />
      </div>
    </div>
  );
}
