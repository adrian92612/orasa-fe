import { APP_ROUTES } from "@/constants/routes";
import { useUser } from "@/context/UserContext";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

type RouteGuardProps = {
  children: ReactNode;
  variant?: "private" | "public" | "onboarding";
};

const RouteGuard = ({ children, variant = "private" }: RouteGuardProps) => {
  const { user, isLoading } = useUser();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );

  const getRedirect = () => {
    switch (variant) {
      case "private":
        if (!user) return APP_ROUTES.LOGIN;
        if (!user.businessId) return APP_ROUTES.ONBOARDING;
        break;
      case "public":
        if (user)
          return user.businessId
            ? APP_ROUTES.DASHBOARD.ANALYTICS
            : APP_ROUTES.ONBOARDING;
        break;
      case "onboarding":
        if (!user) return APP_ROUTES.LOGIN;
        if (user.businessId) return APP_ROUTES.DASHBOARD.ANALYTICS;
        break;
    }
    return null;
  };

  const redirect = getRedirect();
  if (redirect) return <Navigate to={redirect} replace />;

  return <>{children}</>;
};

export default RouteGuard;
