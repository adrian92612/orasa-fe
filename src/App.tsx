import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/context/UserContext";
import { APP_ROUTES } from "@/constants/routes";
import RouteGuard from "./components/common/RouteGuard";

const queryClient = new QueryClient();
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const OnboardingPage = lazy(() => import("@/pages/OnboardingPage"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const AnalyticsPage = lazy(() => import("./pages/dashboard/AnalyticsPage"));
const AppointmentsPage = lazy(
  () => import("./pages/dashboard/AppointmentsPage"),
);
const BranchesPage = lazy(() => import("./pages/dashboard/BranchesPage"));
const ServicesPage = lazy(() => import("./pages/dashboard/ServicesPage"));
const StaffPage = lazy(() => import("./pages/dashboard/StaffPage"));
const ActivityLogsPage = lazy(
  () => import("./pages/dashboard/ActivityLogsPage"),
);
const SmsLogsPage = lazy(() => import("./pages/dashboard/SmsLogsPage"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminDashboardPage = lazy(
  () => import("./pages/admin/AdminDashboardPage"),
);
const SettingsPage = lazy(() => import("./pages/dashboard/SettingsPage"));

import { DashboardSkeleton } from "@/components/features/dashboard/DashboardSkeleton";

import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path={APP_ROUTES.HOME}
                element={<Navigate to={APP_ROUTES.LOGIN} replace />}
              />

              {/* Public routes */}
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

              {/* Dashboard routes */}
              <Route
                path="/dashboard"
                element={
                  <RouteGuard
                    variant="private"
                    children={
                      <Suspense fallback={<DashboardSkeleton />}>
                        <DashboardLayout />
                      </Suspense>
                    }
                  />
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

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <RouteGuard variant="admin" children={<AdminLayout />} />
                }
              >
                <Route
                  index
                  element={<Navigate to={APP_ROUTES.ADMIN.DASHBOARD} replace />}
                />
                <Route path="dashboard" element={<AdminDashboardPage />} />
              </Route>
            </Routes>
          </Suspense>
          <Toaster position="top-right" />
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
