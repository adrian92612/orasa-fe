import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/context/UserContext";
import { APP_ROUTES } from "@/constants/routes";
import LoginPage from "@/pages/LoginPage";
import OnboardingPage from "@/pages/OnboardingPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import AppointmentsPage from "./pages/dashboard/AppointmentsPage";
import ServicesPage from "./pages/dashboard/ServicesPage";
import StaffPage from "./pages/dashboard/StaffPage";
import ActivityLogsPage from "./pages/dashboard/ActivityLogsPage";
import SmsLogsPage from "./pages/dashboard/SmsLogsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import { useUser } from "./context/UserContext";
import RouteGuard from "./components/common/RouteGuard";
import DashboardLayout from "./layouts/DashboardLayout";

const queryClient = new QueryClient();

const DashboardRedirect = () => {
  const { user } = useUser();

  if (user?.role === "STAFF") {
    return <Navigate to={APP_ROUTES.DASHBOARD.APPOINTMENTS} replace />;
  }
  return <Navigate to={APP_ROUTES.DASHBOARD.ANALYTICS} replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path={APP_ROUTES.HOME}
              element={<Navigate to={APP_ROUTES.LOGIN} replace />}
            />
            <Route
              path={APP_ROUTES.LOGIN}
              element={<RouteGuard variant="public" children={<LoginPage />} />}
            />
            <Route
              path={APP_ROUTES.ONBOARDING}
              element={
                <RouteGuard
                  variant="onboarding"
                  children={<OnboardingPage />}
                />
              }
            />
            <Route
              path={APP_ROUTES.DASHBOARD.BASE}
              element={
                <RouteGuard variant="private">
                  <DashboardRedirect />
                </RouteGuard>
              }
            />
            <Route
              path={APP_ROUTES.DASHBOARD.ANALYTICS}
              element={
                <RouteGuard variant="private">
                  <DashboardLayout>
                    <AnalyticsPage />
                  </DashboardLayout>
                </RouteGuard>
              }
            />
            <Route
              path={APP_ROUTES.DASHBOARD.APPOINTMENTS}
              element={
                <RouteGuard variant="private">
                  <DashboardLayout>
                    <AppointmentsPage />
                  </DashboardLayout>
                </RouteGuard>
              }
            />
            <Route
              path={APP_ROUTES.DASHBOARD.SERVICES}
              element={
                <RouteGuard variant="private">
                  <DashboardLayout>
                    <ServicesPage />
                  </DashboardLayout>
                </RouteGuard>
              }
            />
            <Route
              path={APP_ROUTES.DASHBOARD.STAFF}
              element={
                <RouteGuard variant="private">
                  <DashboardLayout>
                    <StaffPage />
                  </DashboardLayout>
                </RouteGuard>
              }
            />
            <Route
              path={APP_ROUTES.DASHBOARD.ACTIVITY_LOGS}
              element={
                <RouteGuard variant="private">
                  <DashboardLayout>
                    <ActivityLogsPage />
                  </DashboardLayout>
                </RouteGuard>
              }
            />
            <Route
              path={APP_ROUTES.DASHBOARD.SMS_LOGS}
              element={
                <RouteGuard variant="private">
                  <DashboardLayout>
                    <SmsLogsPage />
                  </DashboardLayout>
                </RouteGuard>
              }
            />
            <Route
              path={APP_ROUTES.DASHBOARD.SETTINGS}
              element={
                <RouteGuard variant="private">
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                </RouteGuard>
              }
            />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
