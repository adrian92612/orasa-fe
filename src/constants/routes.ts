import { ENV } from "./config";

export const API_ROUTES = {
  AUTH: {
    LOGIN_OWNER: `${ENV.API_URL}/auth/google`,
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
  SERVICES: {
    CREATE: `${ENV.API_URL}/services`,
  },
  STAFF: {
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
    CLIENTS: "/dashboard/clients",
    SERVICES: "/dashboard/services",
    STAFF: "/dashboard/staff",
    SETTINGS: "/dashboard/settings",
  },
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  CHANGE_PASSWORD: "/change-password",
} as const;
