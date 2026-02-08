import { APP_ROUTES } from "@/constants/routes";
import {
  BarChart3,
  Calendar,
  Settings,
  Users,
  UserCheck,
  FileText,
  MessageCircle,
  Building2,
  type LucideIcon,
} from "lucide-react";

type roles = "OWNER" | "ADMIN" | "STAFF";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  allowedRoles: roles[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Analytics",
    url: APP_ROUTES.DASHBOARD.ANALYTICS,
    icon: BarChart3,
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    title: "Appointments",
    url: APP_ROUTES.DASHBOARD.APPOINTMENTS,
    icon: Calendar,
    allowedRoles: ["OWNER", "ADMIN", "STAFF"],
  },
  {
    title: "Services",
    url: APP_ROUTES.DASHBOARD.SERVICES,
    icon: UserCheck,
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    title: "Branches",
    url: APP_ROUTES.DASHBOARD.BRANCHES,
    icon: Building2,
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    title: "Staff",
    url: APP_ROUTES.DASHBOARD.STAFF,
    icon: Users,
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    title: "Activity Logs",
    url: APP_ROUTES.DASHBOARD.ACTIVITY_LOGS,
    icon: FileText,
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    title: "SMS Logs",
    url: APP_ROUTES.DASHBOARD.SMS_LOGS,
    icon: MessageCircle,
    allowedRoles: ["OWNER", "ADMIN", "STAFF"],
  },
  {
    title: "Settings",
    url: APP_ROUTES.DASHBOARD.SETTINGS,
    icon: Settings,
    allowedRoles: ["OWNER", "ADMIN", "STAFF"],
  },
];
