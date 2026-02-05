import { ENV } from "./config";

export const API_ROUTES = {
  AUTH: {
    LOGIN_OWNER: `${ENV.API_URL}/auth/google`,
    LOGOUT: `${ENV.API_URL}/auth/logout`,
    REGISTER: `${ENV.API_URL}/auth/register`,
    FORGOT_PASSWORD: `${ENV.API_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${ENV.API_URL}/auth/reset-password`,
    CHANGE_PASSWORD: `${ENV.API_URL}/auth/change-password`,
  },
} as const;

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ONBOARDING: "/onboarding",
  DASHBOARD: "/dashboard",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  CHANGE_PASSWORD: "/change-password",
} as const;
