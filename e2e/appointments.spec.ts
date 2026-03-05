import { test, expect } from "@playwright/test";

test.describe("Appointment Management Flow", () => {
  const mockBranches = [
    { id: "branch-1", name: "Main Branch" },
    { id: "branch-2", name: "Second Branch" },
  ];

  const mockServices = [
    {
      id: "srv-1",
      serviceId: "srv-1",
      serviceName: "Consultation",
      durationMinutes: 30,
      price: 500,
      active: true,
    },
  ];

  const mockReminders = [
    {
      id: "rem-1",
      type: "SCHEDULED",
      messageTemplate: "Reminder for your appointment",
      leadTimeMinutes: 1440, // 1 day
      enabled: true,
    },
  ];

  test.beforeEach(async ({ page }) => {
    // Shared mocks for all tests in this suite
    await page.route("**/api/branches", async (route) => {
      await route.fulfill({
        status: 200,
        json: { success: true, data: mockBranches },
      });
    });

    await page.route("**/api/businesses/me", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            id: "biz-1",
            subscriptionStatus: "ACTIVE",
          },
        },
      });
    });

    await page.route("**/api/branches/*/services*", async (route) => {
      await route.fulfill({
        status: 200,
        json: { success: true, data: mockServices },
      });
    });

    await page.route("**/api/reminder-configs*", async (route) => {
      await route.fulfill({
        status: 200,
        json: { success: true, data: mockReminders },
      });
    });

    await page.route("**/api/appointments/branch/*/search*", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            content: [],
            totalElements: 0,
            totalPages: 0,
            number: 0,
          },
        },
      });
    });

    await page.route("**/api/appointments/business/*/search*", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            content: [],
            totalElements: 0,
            totalPages: 0,
            number: 0,
          },
        },
      });
    });

    await page.route("**/api/appointments/branch/*", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            content: [],
            totalElements: 0,
            totalPages: 0,
            number: 0,
          },
        },
      });
    });

    await page.route("**/api/appointments/counts*", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            todayCount: 0,
            upcomingCount: 0,
          },
        },
      });
    });

    await page.route("**/api/users/me/preferences*", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            smsBalance: 100,
          },
        },
      });
    });

    // Add console listener to see what API requests are failing/firing
    page.on("requestfailed", (request) => console.log("FAILED:", request.url(), request.failure()?.errorText));
    page.on("console", (msg) => {
      if (msg.type() === "error") console.log("PAGE ERROR:", msg.text());
    });
  });

  test("Owner can create a scheduled appointment", async ({ page }) => {
    // 1. Mock Auth as Owner
    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            id: "owner-1",
            role: "OWNER",
            businessId: "biz-1",
          },
        },
      });
    });

    // Mock create appointment endpoint
    let createdPayload: unknown = null;
    await page.route("**/api/appointments", async (route) => {
      if (route.request().method() === "POST") {
        createdPayload = route.request().postDataJSON();
        await route.fulfill({
          status: 201,
          json: { success: true, data: { id: "new-appt-1" }, message: "Appointment created successfully" },
        });
      } else {
        await route.continue();
      }
    });

    // 2. Go to Appointments Page
    await page.goto("/dashboard/appointments");

    // Wait for the page to load
    await expect(page.getByRole("heading", { name: "Appointments" })).toBeVisible();

    // 3. Click New Appointment
    await page.getByRole("button", { name: "New Appointment" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // 4. Fill Scheduled Appointment Form
    await page.getByLabel("Customer name").fill("John Doe");
    await page.getByLabel("Customer Phone").fill("09123456789");

    // Select Branch
    await page.getByText("Select a branch").click();
    await page.getByRole("option", { name: "Main Branch" }).click();

    // Select Service (Combobox)
    await page.getByText("Select services").click();
    await page.getByRole("option").filter({ hasText: "Consultation (30 min)" }).click();
    await page.keyboard.press("Escape"); // Close the multi-select dropdown

    // Reminders should be visible for scheduled appointments
    await expect(page.getByText("Reminders", { exact: true })).toBeVisible();

    // 5. Submit
    await page.getByRole("button", { name: "Create Appointment" }).click();

    // 6. Verify success (Dialog closes, success message)
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.getByText("Appointment created successfully")).toBeVisible();

    // Verify correct payload was sent
    expect(createdPayload).toMatchObject({
      customerName: "John Doe",
      customerPhone: "09123456789",
      serviceIds: ["srv-1"],
      isWalkin: false,
    });
  });

  test("Staff can create a walk-in appointment without reminders", async ({ page }) => {
    // 1. Mock Auth as Staff
    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            id: "staff-1",
            role: "STAFF",
            businessId: "biz-1",
            branchIds: ["branch-1"],
          },
        },
      });
    });

    // Mock create appointment endpoint
    let createdPayload: unknown = null;
    await page.route("**/api/appointments", async (route) => {
      if (route.request().method() === "POST") {
        createdPayload = route.request().postDataJSON();
        await route.fulfill({
          status: 201,
          json: { success: true, data: { id: "new-walkin-1" }, message: "Appointment created successfully" },
        });
      } else {
        await route.continue();
      }
    });

    // 2. Go to Appointments Page
    await page.goto("/dashboard/appointments");

    // Staff doesn't have Branch Switcher, but should see Appointments
    await expect(page.getByRole("heading", { name: "Appointments" })).toBeVisible();

    // 3. Click New Appointment
    await page.getByRole("button", { name: "New Appointment" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // 4. Toggle Walk-in
    const walkinSwitch = page.getByRole("switch", { name: "Walk-in Appointment" });
    await walkinSwitch.click();

    // Verify Reminders vanished
    await expect(page.getByText("Reminders", { exact: true })).not.toBeVisible();

    // Fill Form
    await page.getByLabel("Customer name").fill("Jane Smith");
    await page.getByLabel("Customer Phone").fill("09987654321");

    // Select Branch
    await page.getByText("Select a branch").click();
    await page.getByRole("option", { name: "Main Branch" }).click();

    // Select Service (Combobox)
    await page.getByText("Select services").click();
    await page.getByRole("option").filter({ hasText: "Consultation (30 min)" }).click();
    await page.keyboard.press("Escape"); // Close the multi-select dropdown

    // 5. Submit
    await page.getByRole("button", { name: "Create Appointment" }).click();

    // 6. Verify success
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.getByText("Appointment created successfully")).toBeVisible();

    // Verify correct payload was sent
    expect(createdPayload).toMatchObject({
      customerName: "Jane Smith",
      customerPhone: "09987654321",
      serviceIds: ["srv-1"],
      isWalkin: true,
    });
  });

  test("Owner can change branch and services clear", async ({ page }) => {
    // 1. Mock Auth as Owner
    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            id: "owner-1",
            role: "OWNER",
            businessId: "biz-1",
          },
        },
      });
    });

    // 2. Go to Appointments Page
    await page.goto("/dashboard/appointments");
    await expect(page.getByRole("heading", { name: "Appointments" })).toBeVisible();

    // 3. Click New Appointment
    await page.getByRole("button", { name: "New Appointment" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // 4. Select initial branch and service
    await page.getByText("Select a branch").click();
    await page.getByRole("option", { name: "Main Branch" }).click();

    await page.getByText("Select services").click();
    await page.getByRole("option").filter({ hasText: "Consultation (30 min)" }).click();
    await page.keyboard.press("Escape"); // Close multi-select

    // Verify service is selected (we check for the badge that gets added)
    await expect(page.getByText("Consultation", { exact: true })).toBeVisible();

    // 5. Change branch
    await page.locator("button", { hasText: "Main Branch" }).click(); // Re-open branch selector
    await page.getByRole("option", { name: "Second Branch" }).click();

    // 6. Verify service is cleared
    await expect(page.getByText("Consultation", { exact: true })).not.toBeVisible();
    await expect(page.getByText("Select services")).toBeVisible();
  });
});
