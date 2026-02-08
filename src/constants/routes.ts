import { ENV } from "./config";

export const API_ROUTES = {
  AUTH: {
    LOGIN_OWNER: `${ENV.API_URL}/auth/google`,
    LOGIN_STAFF: `${ENV.API_URL}/auth/staff/login`,
    LOGOUT: `${ENV.API_URL}/auth/logout`,
    REGISTER: `${ENV.API_URL}/auth/register`,
    FORGOT_PASSWORD: `${ENV.API_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${ENV.API_URL}/auth/reset-password`,
    CHANGE_PASSWORD: `${ENV.API_URL}/auth/change-password`,
    ME: `${ENV.API_URL}/auth/me`,
  },
  BUSINESSES: {
    CREATE: `${ENV.API_URL}/businesses`,
    COMPLETE_ONBOARDING: `${ENV.API_URL}/businesses/onboarding/complete`,
  },
  BRANCHES: {
    BASE: `${ENV.API_URL}/branches`,
    BY_ID: (id: string) => `${ENV.API_URL}/branches/${id}`,
    SERVICES: {
      BASE: (branchId: string) =>
        `${ENV.API_URL}/branches/${branchId}/services`,
      BY_ID: (branchId: string, serviceId: string) =>
        `${ENV.API_URL}/branches/${branchId}/services/${serviceId}`,
    },
  },
  SERVICES: {
    BASE: `${ENV.API_URL}/services`,
    CREATE: `${ENV.API_URL}/services`,
    BY_ID: (id: string) => `${ENV.API_URL}/services/${id}`,
  },
  STAFF: {
    BASE: `${ENV.API_URL}/staff`,
    CREATE: `${ENV.API_URL}/staff`,
  },
} as const;

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ONBOARDING: "/onboarding",
  DASHBOARD: {
    BASE: "/dashboard",
    ANALYTICS: "/dashboard/analytics",
    APPOINTMENTS: "/dashboard/appointments",
    BRANCHES: "/dashboard/branches",
    SERVICES: "/dashboard/services",
    STAFF: "/dashboard/staff",
    ACTIVITY_LOGS: "/dashboard/activity-logs",
    SMS_LOGS: "/dashboard/sms-logs",
    SETTINGS: "/dashboard/settings",
  },
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  CHANGE_PASSWORD: "/change-password",
} as const;
