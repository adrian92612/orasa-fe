import { APP_ROUTES } from "@/constants/routes";
import { useUser } from "@/context/UserContext";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

import { NAV_ITEMS } from "@/constants/navigation";

const STAFF_ALLOWED_ROUTES = NAV_ITEMS.filter((item) =>
  item.allowedRoles.includes("STAFF"),
).map((item) => item.url);

type RouteGuardProps = {
  children: ReactNode;
  variant?: "private" | "public" | "onboarding";
};

const RouteGuard = ({ children, variant = "private" }: RouteGuardProps) => {
  const { user, isLoading } = useUser();
  const location = useLocation();

  const staffInAllowedRoute = STAFF_ALLOWED_ROUTES.some((route) =>
    location.pathname.startsWith(route),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getRedirect = () => {
    switch (variant) {
      case "private":
        if (!user) return APP_ROUTES.LOGIN;
        if (!user.businessId) return APP_ROUTES.ONBOARDING;
        if (user.role === "STAFF" && !staffInAllowedRoute)
          return APP_ROUTES.DASHBOARD.APPOINTMENTS;
        break;

      case "public":
        if (!user) break;

        if (!user.businessId) return APP_ROUTES.ONBOARDING;

        if (user.role === "STAFF") return APP_ROUTES.DASHBOARD.APPOINTMENTS;

        return APP_ROUTES.DASHBOARD.ANALYTICS;

      case "onboarding":
        if (!user) return APP_ROUTES.LOGIN;

        if (user.businessId) {
          return user.role === "STAFF"
            ? APP_ROUTES.DASHBOARD.APPOINTMENTS
            : APP_ROUTES.DASHBOARD.ANALYTICS;
        }
        break;
    }

    return null;
  };

  const redirect = getRedirect();
  if (redirect) return <Navigate to={redirect} replace />;

  return <>{children}</>;
};

export default RouteGuard;
