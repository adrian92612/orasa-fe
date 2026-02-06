import { APP_ROUTES } from "@/constants/routes";
import {
  BarChart3,
  Calendar,
  Settings,
  Users,
  UserCheck,
  FileText,
  MessageCircle,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    title: "Analytics",
    url: APP_ROUTES.DASHBOARD.ANALYTICS,
    icon: BarChart3,
  },
  {
    title: "Appointments",
    url: APP_ROUTES.DASHBOARD.APPOINTMENTS,
    icon: Calendar,
  },
  {
    title: "Services",
    url: APP_ROUTES.DASHBOARD.SERVICES,
    icon: UserCheck,
  },
  {
    title: "Staff",
    url: APP_ROUTES.DASHBOARD.STAFF,
    icon: Users,
  },
  {
    title: "Activity Logs",
    url: APP_ROUTES.DASHBOARD.ACTIVITY_LOGS,
    icon: FileText,
  },
  {
    title: "SMS Logs",
    url: APP_ROUTES.DASHBOARD.SMS_LOGS,
    icon: MessageCircle,
  },
  {
    title: "Settings",
    url: APP_ROUTES.DASHBOARD.SETTINGS,
    icon: Settings,
  },
];
