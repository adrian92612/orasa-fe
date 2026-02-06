import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/context/UserContext";
import { APP_ROUTES } from "@/constants/routes";
import LoginPage from "@/pages/LoginPage";
import OnboardingPage from "@/pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import RouteGuard from "./components/common/RouteGuard";

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
              path={APP_ROUTES.DASHBOARD.BASE}
              element={<Navigate to={APP_ROUTES.DASHBOARD.ANALYTICS} />}
            />
            <Route
              path={APP_ROUTES.DASHBOARD.ANALYTICS}
              element={
                <RouteGuard variant="private" children={<DashboardPage />} />
              }
            />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
