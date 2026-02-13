import { ENV } from "./config";

export const API_ROUTES = {
  AUTH: {
    LOGIN_OWNER: `${ENV.API_URL}/auth/google`,
    LOGIN_STAFF: `${ENV.API_URL}/auth/staff/login`,
    LOGOUT: `${ENV.API_URL}/auth/logout`,
    REGISTER: `${ENV.API_URL}/auth/register`,
    FORGOT_PASSWORD: `${ENV.API_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${ENV.API_URL}/auth/reset-password`,
    CHANGE_PASSWORD: `${ENV.API_URL}/profile/change-password`,
    ME: `${ENV.API_URL}/auth/me`,
  },
  ADMIN: {
    BUSINESSES: `${ENV.API_URL}/admin/businesses`,
    EXTEND_SUBSCRIPTION: (businessId: string) =>
      `${ENV.API_URL}/admin/businesses/${businessId}/subscription/extend`,
    ACTIVATE_SUBSCRIPTION: (businessId: string) =>
      `${ENV.API_URL}/admin/businesses/${businessId}/subscription/activate`,
    CANCEL_SUBSCRIPTION: (businessId: string) =>
      `${ENV.API_URL}/admin/businesses/${businessId}/subscription/cancel`,
    ADD_CREDITS: (id: string) =>
      `${ENV.API_URL}/admin/businesses/${id}/add-credits`,
  },
  BUSINESSES: {
    CREATE: `${ENV.API_URL}/businesses`,
    ME: `${ENV.API_URL}/businesses/me`,
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
    BY_ID: (id: string) => `${ENV.API_URL}/staff/${id}`,
  },
  REMINDER_CONFIGS: {
    BASE: `${ENV.API_URL}/reminder-configs`,
    BY_ID: (id: string) => `${ENV.API_URL}/reminder-configs/${id}`,
  },
  APPOINTMENTS: {
    BASE: `${ENV.API_URL}/appointments`,
    BY_ID: (id: string) => `${ENV.API_URL}/appointments/${id}`,
    BY_BRANCH: (branchId: string) =>
      `${ENV.API_URL}/appointments/branch/${branchId}`,
    BY_BUSINESS: (businessId: string) =>
      `${ENV.API_URL}/appointments/business/${businessId}`,
    SEARCH: (branchId: string) =>
      `${ENV.API_URL}/appointments/branch/${branchId}/search`,
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
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    LOGIN: "/admin/login", // Still useful for structure, even if it redirects or uses same component
  },
} as const;
