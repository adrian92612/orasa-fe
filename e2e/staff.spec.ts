import { test, expect } from "@playwright/test";

test.describe("Staff Management", () => {
  const mockOwner = {
    userId: "owner-1",
    username: "Owner User",
    role: "OWNER",
    businessId: "biz-123",
    businessName: "Test Clinic",
  };

  const mockStaffUser = {
    userId: "staff-1",
    username: "Staff Member",
    role: "STAFF",
    businessId: "biz-123",
    businessName: "Test Clinic",
  };

  const mockBranches = [
    { id: "branch-1", name: "Main Branch" },
    { id: "branch-2", name: "Secondary Branch" },
  ];

  const mockStaffList = [
    {
      id: "staff-1",
      username: "staff_one",
      role: "STAFF",
      branches: [{ id: "branch-1", name: "Main Branch" }],
      businessId: "biz-123",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  test.beforeEach(async ({ page }) => {
    // Default mock for branches and business info to avoid timeouts
    await page.route("**/api/branches*", async (route) => {
      await route.fulfill({ status: 200, json: { success: true, data: mockBranches } });
    });
    await page.route("**/api/businesses/me*", async (route) => {
      await route.fulfill({ status: 200, json: { success: true, data: { subscriptionStatus: "ACTIVE" } } });
    });
  });

  test("Owner can view, add and edit staff members", async ({ page }) => {
    // Capture console logs for debugging
    page.on("console", (msg) => console.log("OWNER_TEST_CONSOLE:", msg.text()));

    // Mock ALL API requests to avoid CONNECTION_REFUSED
    await page.route("**/api/**", async (route) => {
      const method = route.request().method();
      const url = route.request().url();
      console.log(`MOCK REQUEST: ${method} ${url}`);

      if (url.includes("/auth/me")) {
        return route.fulfill({ status: 200, json: { success: true, data: mockOwner } });
      }

      if (url.includes("/businesses/me")) {
        return route.fulfill({ status: 200, json: { success: true, data: { subscriptionStatus: "ACTIVE" } } });
      }

      if (url.includes("/branches")) {
        return route.fulfill({ status: 200, json: { success: true, data: mockBranches } });
      }

      if (url.includes("/staff")) {
        if (method === "GET") {
          return route.fulfill({ status: 200, json: { success: true, data: mockStaffList } });
        } else if (method === "POST") {
          const body = route.request().postDataJSON();
          return route.fulfill({
            status: 201,
            json: {
              success: true,
              message: "Staff member created",
              data: { ...body, id: "new-staff-id", userId: "new-user-id", role: "STAFF" },
            },
          });
        } else if (method === "PUT") {
          return route.fulfill({ status: 200, json: { success: true, message: "Staff member updated" } });
        }
      }

      // Default fallback for any other API call
      return route.fulfill({ status: 200, json: { success: true, data: [] } });
    });

    await page.goto("/dashboard/staff");

    // Verify list view
    await expect(page.getByText("staff_one")).toBeVisible();
    await expect(page.getByText("Main Branch")).toBeVisible();

    // Add Staff
    await page.getByRole("button", { name: /add staff/i }).click();
    await expect(page.getByText(/add staff member/i)).toBeVisible();

    await page.getByLabel(/username/i).fill("new_staff");
    await page.getByLabel(/^password/i).fill("password123");
    await page.getByLabel(/confirm password/i).fill("password123");
    await page.getByLabel(/secondary branch/i).check();

    await page.getByRole("button", { name: /create staff/i }).click();

    // Verify success toast
    await expect(page.getByText(/created/i).first()).toBeVisible();

    // Edit Staff
    await page.getByRole("button", { name: "Edit" }).first().click();

    await expect(page.getByText(/edit staff/i)).toBeVisible();
    // Use a different branch to ensure change
    await page.getByLabel(/secondary branch/i).check();

    await page.getByRole("button", { name: /save changes/i }).click();

    await expect(page.getByText(/updated/i).first()).toBeVisible();
  });

  test("Staff role is restricted from Staff Management page", async ({ page }) => {
    // Mock user as Staff
    await page.route("**/api/auth/me*", async (route) => {
      await route.fulfill({ status: 200, json: { success: true, data: mockStaffUser } });
    });

    // Attempt to go to staff page
    await page.goto("/dashboard/staff");

    // Should be redirected to dashboard/appointments (default for staff)
    await page.waitForURL(/.*\/dashboard\/appointments/, { timeout: 10000 });

    await expect(page).toHaveURL(/.*\/dashboard\/appointments/);

    // Sidebar should not have Staff link
    await expect(page.getByRole("link", { name: "Staff" })).not.toBeVisible();
  });
});
