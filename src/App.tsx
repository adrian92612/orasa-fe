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

import RouteGuard from "./components/common/RouteGuard";
import DashboardLayout from "./layouts/DashboardLayout";

const queryClient = new QueryClient();

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
              path="/dashboard"
              element={
                <RouteGuard variant="private" children={<DashboardLayout />} />
              }
            >
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="staff" element={<StaffPage />} />
              <Route path="activity-logs" element={<ActivityLogsPage />} />
              <Route path="sms-logs" element={<SmsLogsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
