import { render } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import RouteGuard from "@/components/common/RouteGuard";
import { useUser } from "@/context/UserContext";
import { useLocation } from "react-router";

// Mock Navigate to return a simple span with the target to text
vi.mock("react-router", () => ({
  Navigate: ({ to, replace }: { to: string; replace?: boolean }) => (
    <span data-testid="navigate-mock" data-to={to} data-replace={replace} />
  ),
  useLocation: vi.fn(),
}));

// Mock useUser context
vi.mock("@/context/UserContext", () => ({
  useUser: vi.fn(),
}));

describe("RouteGuard", () => {
  const mockChildren = <div data-testid="protected-content">Content</div>;

  beforeEach(() => {
    vi.resetAllMocks();
    (useLocation as Mock).mockReturnValue({ pathname: "/dashboard/analytics" });
  });

  const renderGuard = (variant: "private" | "public" | "onboarding" | "admin" = "private") => {
    return render(<RouteGuard variant={variant}>{mockChildren}</RouteGuard>);
  };

  describe("variant = 'private'", () => {
    it("redirects to login if user is not authenticated", () => {
      (useUser as Mock).mockReturnValue({ user: null });
      const { getByTestId } = renderGuard("private");

      expect(getByTestId("navigate-mock").getAttribute("data-to")).toBe("/login");
    });

    it("redirects ADMIN to admin dashboard when trying to access private dashboard", () => {
      (useUser as Mock).mockReturnValue({ user: { role: "ADMIN", businessId: "123" } });
      const { getByTestId } = renderGuard("private");

      expect(getByTestId("navigate-mock").getAttribute("data-to")).toBe("/admin/dashboard");
    });

    it("redirects OWNER to onboarding if no businessId exists", () => {
      (useUser as Mock).mockReturnValue({ user: { role: "OWNER", businessId: null } });
      const { getByTestId } = renderGuard("private");

      expect(getByTestId("navigate-mock").getAttribute("data-to")).toBe("/onboarding");
    });

    it("renders children for OWNER with businessId", () => {
      (useUser as Mock).mockReturnValue({ user: { role: "OWNER", businessId: "123" } });
      const { getByTestId } = renderGuard("private");

      expect(getByTestId("protected-content")).toBeInTheDocument();
    });

    it("redirects STAFF to appointments if they access an unauthorized dashboard route", () => {
      (useUser as Mock).mockReturnValue({ user: { role: "STAFF", businessId: "123" } });
      // STAFF is not allowed in /dashboard/analytics
      (useLocation as Mock).mockReturnValue({ pathname: "/dashboard/analytics" });

      const { getByTestId } = renderGuard("private");

      expect(getByTestId("navigate-mock").getAttribute("data-to")).toBe("/dashboard/appointments");
    });

    it("renders children for STAFF in an authorized route", () => {
      (useUser as Mock).mockReturnValue({ user: { role: "STAFF", businessId: "123" } });
      (useLocation as Mock).mockReturnValue({ pathname: "/dashboard/appointments" });

      const { getByTestId } = renderGuard("private");

      expect(getByTestId("protected-content")).toBeInTheDocument();
    });
  });

  describe("variant = 'public'", () => {
    it("renders children for unauthenticated user", () => {
      (useUser as Mock).mockReturnValue({ user: null });
      const { getByTestId } = renderGuard("public");

      expect(getByTestId("protected-content")).toBeInTheDocument();
    });

    it("redirects ADMIN to admin dashboard", () => {
      (useUser as Mock).mockReturnValue({ user: { role: "ADMIN", businessId: "123" } });
      const { getByTestId } = renderGuard("public");

      expect(getByTestId("navigate-mock").getAttribute("data-to")).toBe("/admin/dashboard");
    });

    it("redirects OWNER without businessId to onboarding", () => {
      (useUser as Mock).mockReturnValue({ user: { role: "OWNER", businessId: null } });
      const { getByTestId } = renderGuard("public");

      expect(getByTestId("navigate-mock").getAttribute("data-to")).toBe("/onboarding");
    });

    it("redirects STAFF to appointments", () => {
      (useUser as Mock).mockReturnValue({ user: { role: "STAFF", businessId: "123" } });
      const { getByTestId } = renderGuard("public");

      expect(getByTestId("navigate-mock").getAttribute("data-to")).toBe("/dashboard/appointments");
    });

    it("redirects OWNER with businessId to analytics dashboard", () => {
      (useUser as Mock).mockReturnValue({ user: { role: "OWNER", businessId: "123" } });
      const { getByTestId } = renderGuard("public");

      expect(getByTestId("navigate-mock").getAttribute("data-to")).toBe("/dashboard/analytics");
    });
  });

  describe("variant = 'onboarding'", () => {
    it("redirects to login if user is not authenticated", () => {
      (useUser as Mock).mockReturnValue({ user: null });
      const { getByTestId } = renderGuard("onboarding");

      expect(getByTestId("navigate-mock").getAttribute("data-to")).toBe("/login");
    });

    it("renders children for OWNER without businessId", () => {
      (useUser as Mock).mockReturnValue({ user: { role: "OWNER", businessId: null } });
      const { getByTestId } = renderGuard("onboarding");

      expect(getByTestId("protected-content")).toBeInTheDocument();
    });

    it("redirects ADMIN to admin dashboard", () => {
      (useUser as Mock).mockReturnValue({ user: { role: "ADMIN", businessId: "123" } });
      const { getByTestId } = renderGuard("onboarding");

      expect(getByTestId("navigate-mock").getAttribute("data-to")).toBe("/admin/dashboard");
    });

    it("redirects OWNER with businessId to analytics dashboard", () => {
      (useUser as Mock).mockReturnValue({ user: { role: "OWNER", businessId: "123" } });
      const { getByTestId } = renderGuard("onboarding");

      expect(getByTestId("navigate-mock").getAttribute("data-to")).toBe("/dashboard/analytics");
    });

    it("redirects STAFF with businessId to appointments dashboard", () => {
      (useUser as Mock).mockReturnValue({ user: { role: "STAFF", businessId: "123" } });
      const { getByTestId } = renderGuard("onboarding");

      expect(getByTestId("navigate-mock").getAttribute("data-to")).toBe("/dashboard/appointments");
    });
  });

  describe("variant = 'admin'", () => {
    it("redirects to login if user is not authenticated", () => {
      (useUser as Mock).mockReturnValue({ user: null });
      const { getByTestId } = renderGuard("admin");

      expect(getByTestId("navigate-mock").getAttribute("data-to")).toBe("/login");
    });

    it("renders children for ADMIN", () => {
      (useUser as Mock).mockReturnValue({ user: { role: "ADMIN", businessId: "123" } });
      const { getByTestId } = renderGuard("admin");

      expect(getByTestId("protected-content")).toBeInTheDocument();
    });

    it("redirects OWNER to analytics dashboard", () => {
      (useUser as Mock).mockReturnValue({ user: { role: "OWNER", businessId: "123" } });
      const { getByTestId } = renderGuard("admin");

      expect(getByTestId("navigate-mock").getAttribute("data-to")).toBe("/dashboard/analytics");
    });

    it("redirects STAFF to analytics (which will then redirect them again inside private dashboard guard)", () => {
      // For variant 'admin', code current says if user.role !== "ADMIN" return APP_ROUTES.DASHBOARD.ANALYTICS (line 56)
      (useUser as Mock).mockReturnValue({ user: { role: "STAFF", businessId: "123" } });
      const { getByTestId } = renderGuard("admin");

      expect(getByTestId("navigate-mock").getAttribute("data-to")).toBe("/dashboard/analytics");
    });
  });
});
