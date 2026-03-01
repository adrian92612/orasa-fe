import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/context/UserContext";
import { APP_ROUTES } from "@/constants/routes";
import RouteGuard from "./components/common/RouteGuard";
import FullPageLoading from "./components/common/FullPageLoading";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import OnboardingPage from "@/pages/OnboardingPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import AppointmentsPage from "./pages/dashboard/AppointmentsPage";
import BranchesPage from "./pages/dashboard/BranchesPage";
import ServicesPage from "./pages/dashboard/ServicesPage";
import StaffPage from "./pages/dashboard/StaffPage";
import ActivityLogsPage from "./pages/dashboard/ActivityLogsPage";
import SmsLogsPage from "./pages/dashboard/SmsLogsPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

import { DashboardSkeleton } from "@/components/features/dashboard/DashboardSkeleton";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ThemeProvider defaultTheme="system" storageKey="orasa-ui-theme">
          <BrowserRouter>
            <Suspense fallback={<FullPageLoading />}>
              <Routes>
                <Route path={APP_ROUTES.HOME} element={<HomePage />} />

                <Route
                  path={APP_ROUTES.LOGIN}
                  element={
                    <RouteGuard variant="public" children={<LoginPage />} />
                  }
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
                    <RouteGuard variant="private">
                      <Suspense fallback={<DashboardSkeleton />}>
                        <DashboardLayout />
                      </Suspense>
                    </RouteGuard>
                  }
                >
                  <Route index element={<Navigate to="analytics" replace />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="appointments" element={<AppointmentsPage />} />
                  <Route path="branches" element={<BranchesPage />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="staff" element={<StaffPage />} />
                  <Route path="activity-logs" element={<ActivityLogsPage />} />
                  <Route path="sms-logs" element={<SmsLogsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                <Route
                  path="/admin"
                  element={
                    <RouteGuard variant="admin" children={<AdminLayout />} />
                  }
                >
                  <Route
                    index
                    element={
                      <Navigate to={APP_ROUTES.ADMIN.DASHBOARD} replace />
                    }
                  />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                </Route>
              </Routes>
            </Suspense>
            <Toaster position="top-right" />
          </BrowserRouter>
        </ThemeProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
