import { useLocation } from "react-router";
import { APP_ROUTES } from "@/constants/routes";
import AnalyticsPageSkeleton from "@/components/dashboard/AnalyticsPageSkeleton";
import AppointmentsPageSkeleton from "@/components/features/appointments/AppointmentsPageSkeleton";
import BranchesPageSkeleton from "@/components/features/branches/BranchesPageSkeleton";
import ServicesPageSkeleton from "@/components/features/services/ServicesPageSkeleton";
import StaffPageSkeleton from "@/components/features/staff/StaffPageSkeleton";
import ActivityLogsPageSkeleton from "@/components/features/activity-logs/ActivityLogsPageSkeleton";
import SmsLogsPageSkeleton from "@/components/features/sms/SmsLogsPageSkeleton";
import SettingsPageSkeleton from "@/components/features/settings/SettingsPageSkeleton";

export const PageSkeleton = () => {
  const location = useLocation();
  const path = location.pathname;

  switch (path) {
    case APP_ROUTES.DASHBOARD.ANALYTICS:
      return <AnalyticsPageSkeleton />;
    case APP_ROUTES.DASHBOARD.APPOINTMENTS:
      return <AppointmentsPageSkeleton />;
    case APP_ROUTES.DASHBOARD.BRANCHES:
      return <BranchesPageSkeleton />;
    case APP_ROUTES.DASHBOARD.SERVICES:
      return <ServicesPageSkeleton />;
    case APP_ROUTES.DASHBOARD.STAFF:
      return <StaffPageSkeleton />;
    case APP_ROUTES.DASHBOARD.ACTIVITY_LOGS:
      return <ActivityLogsPageSkeleton />;
    case APP_ROUTES.DASHBOARD.SMS_LOGS:
      return <SmsLogsPageSkeleton />;
    case APP_ROUTES.DASHBOARD.SETTINGS:
      return <SettingsPageSkeleton />;
    default:
      return <AppointmentsPageSkeleton />;
  }
};
