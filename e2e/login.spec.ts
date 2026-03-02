import { test, expect } from "@playwright/test";

test.describe("Login & Routing Flow", () => {
  test.describe("Unauthenticated User", () => {
    test("redirects dashboard attempts to login", async ({ page }) => {
      // Intercept the /auth/me call to simulate logged out state
      await page.route("**/api/auth/me*", async (route) => {
        await route.fulfill({
          status: 401,
          json: { success: false, message: "Unauthorized" },
        });
      });

      await page.goto("/dashboard/appointments");

      // Should be redirected to login
      await expect(page).toHaveURL(/.*\/login/);
      await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    });
  });

  test.describe("Owner Flow", () => {
    test("shows Google Sign in button", async ({ page }) => {
      // Mock unauthenticated
      await page.route("**/api/auth/me*", async (route) => {
        await route.fulfill({
          status: 401,
          json: { success: false, message: "Unauthorized" },
        });
      });

      await page.goto("/login");

      // Owner tab is default
      await expect(page.getByRole("button", { name: /sign in with google/i })).toBeVisible();
      // Should not see staff form yet
      await expect(page.getByLabel("Username")).not.toBeVisible();
    });

    test("redirects new owner to onboarding", async ({ page }) => {
      // Mock logged in owner without a businessId
      await page.route("**/api/auth/me*", async (route) => {
        await route.fulfill({
          status: 200,
          json: {
            success: true,
            data: {
              id: "user-1",
              email: "owner@test.com",
              name: "Test Owner",
              role: "OWNER",
              businessId: null, // No business triggers onboarding
            },
          },
        });
      });

      // Navigate to /login to trigger public auth check guards
      await page.goto("/login");

      // App.tsx -> RouteGuard should redirect to /onboarding
      await expect(page).toHaveURL(/.*\/onboarding/);
    });

    test("redirects registered owner to dashboard", async ({ page }) => {
      page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
      page.on("requestfailed", (request) => console.log("FAILED REQ:", request.url(), request.failure()?.errorText));

      // Mock logged in owner with a businessId
      await page.route("**/api/auth/me*", async (route) => {
        await route.fulfill({
          status: 200,
          json: {
            success: true,
            data: {
              userId: "user-1",
              username: "owner@test.com",
              role: "OWNER",
              businessId: "biz-1", // Triggers dashboard
            },
          },
        });
      });

      // Mock the branches/businesses queries that dashboard requires so it doesn't crash
      await page.route("**/api/branches*", async (route) => {
        await route.fulfill({ status: 200, json: { success: true, data: [] } });
      });
      await page.route("**/api/businesses/me*", async (route) => {
        await route.fulfill({ status: 200, json: { success: true, data: { subscriptionStatus: "ACTIVE" } } });
      });

      await page.goto("/login");

      // RouteGuard redirects to dashboard
      await expect(page).toHaveURL(/.*\/dashboard\/analytics/);
    });
  });

  test.describe("Staff Flow", () => {
    test("handles valid staff login", async ({ page }) => {
      let isStaffLoggedIn = false;

      // Mock auth/me dynamically based on login state
      await page.route("**/api/auth/me*", async (route) => {
        if (!isStaffLoggedIn) {
          await route.fulfill({ status: 401, json: { success: false, message: "Unauthorized" } });
        } else {
          await route.fulfill({
            status: 200,
            json: {
              success: true,
              data: {
                userId: "staff-1",
                username: "staffuser",
                role: "STAFF",
                businessId: "biz-1",
                branchIds: ["branch-1"],
              },
            },
          });
        }
      });

      await page.goto("/login");

      // Switch to staff tab
      await page.getByRole("tab", { name: "Staff" }).click();

      // Fill the form
      await page.getByLabel("Username").fill("staffuser");
      await page.getByLabel("Password").fill("password123");

      // Mock the login POST request
      await page.route("**/api/auth/staff/login*", async (route) => {
        await route.fulfill({
          status: 200,
          json: {
            success: true,
            data: {
              id: "staff-1",
              name: "Staff Member",
              role: "STAFF",
              businessId: "biz-1",
              branchIds: ["branch-1"],
            },
            message: "Login successful",
          },
        });
      });

      // Try searching for branch or loading the dashboard skeleton if needed
      await page.route("**/api/branches*", async (route) => {
        await route.fulfill({
          status: 200,
          json: { success: true, data: [] },
        });
      });

      await page.route("**/api/businesses/me*", async (route) => {
        await route.fulfill({
          status: 200,
          json: { success: true, data: { subscriptionStatus: "ACTIVE" } },
        });
      });

      // Click login
      isStaffLoggedIn = true;
      await page.getByRole("button", { name: "Sign in" }).click();

      // RouteGuard should redirect staff to the appointments page, not analytics
      await expect(page).toHaveURL(/.*\/dashboard\/appointments/);
    });

    test("handles invalid staff login", async ({ page }) => {
      await page.route("**/api/auth/me*", async (route) => {
        await route.fulfill({ status: 401 });
      });

      await page.goto("/login");
      await page.getByRole("tab", { name: "Staff" }).click();

      await page.getByLabel("Username").fill("wronguser");
      await page.getByLabel("Password").fill("wrongpass");

      // Mock error response
      await page.route("**/api/auth/staff/login*", async (route) => {
        await route.fulfill({
          status: 401,
          json: { success: false, message: "Invalid username or password" },
        });
      });

      await page.getByRole("button", { name: "Sign in" }).click();

      // Check for error toast or form validation msg
      await expect(page.getByText("Invalid username or password")).toBeVisible();
    });

    test("prevents staff from accessing owner routes", async ({ page }) => {
      // Mock logged in staff
      await page.route("**/api/auth/me*", async (route) => {
        await route.fulfill({
          status: 200,
          json: {
            success: true,
            data: {
              id: "staff-1",
              name: "Staff Member",
              role: "STAFF",
              businessId: "biz-1",
            },
          },
        });
      });

      // Attempt to navigate to a restricted route (branches)
      await page.goto("/dashboard/branches");

      // RouteGuard enforces STAFF_ALLOWED_ROUTES and redirects to /dashboard/appointments
      await expect(page).toHaveURL(/.*\/dashboard\/appointments/);
    });
  });
});
