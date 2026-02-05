export const ENV = {
  API_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  IS_PROD: import.meta.env.PROD,
} as const;
