import { test, expect } from "@playwright/test";

test.describe("SMS Reminder Configuration Flow", () => {
  const mockReminders = [
    {
      id: "rem-1",
      businessId: "biz-1",
      leadTimeMinutes: 60, // 1 hour
      messageTemplate:
        "Reminder: Appointment on {date} @ {time} at {businessName} ({branchName}). Please arrive 15 mins early.",
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  test.beforeEach(async ({ page }) => {
    // Mock authenticated owner
    await page.route("**/api/auth/me*", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            userId: "user-1",
            username: "owner@test.com",
            role: "OWNER",
            businessId: "biz-1",
          },
        },
      });
    });

    // Mock business profile
    await page.route("**/api/businesses/me*", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            id: "biz-1",
            name: "Test Business",
            subscriptionStatus: "ACTIVE",
          },
        },
      });
    });

    // Mock branches (needed for sidebar/general app state)
    await page.route("**/api/branches*", async (route) => {
      await route.fulfill({
        status: 200,
        json: { success: true, data: [] },
      });
    });

    // Initial reminders
    await page.route("**/api/reminder-configs*", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          json: { success: true, data: mockReminders },
        });
      }
    });
  });

  test("navigates to settings and manages SMS reminders", async ({ page }) => {
    await page.goto("/dashboard/analytics");

    // Navigate to Settings
    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page).toHaveURL(/.*\/settings/);

    // Switch to SMS tab
    await page.getByRole("tab", { name: /sms & reminders/i }).click();
    await expect(page.getByRole("heading", { name: "SMS Reminders" })).toBeVisible();

    // Verify initial reminder is shown
    await expect(page.getByText("1 hour before")).toBeVisible();

    // Open Add Reminder Dialog
    await page.getByRole("button", { name: "Add Reminder" }).click();
    await expect(page.getByRole("heading", { name: "Add Reminder" })).toBeVisible();

    // Mock successful creation
    await page.route("**/api/reminder-configs*", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          json: {
            success: true,
            data: {
              id: "rem-2",
              leadTimeMinutes: 120,
              messageTemplate: "Standard",
              enabled: true,
            },
            message: "Reminder config created",
          },
        });
      }
    });

    // Fill form
    await page.getByLabel(/hours/i).fill("2");
    await page.getByLabel(/minutes/i).fill("0");
    // Template is defaulted to the first one in constants

    // Submit
    await page.getByRole("dialog").getByRole("button", { name: "Add Reminder", exact: true }).click();

    // Check for success message (toast)
    await expect(page.getByText("Reminder config created")).toBeVisible();
  });

  test("edits an existing reminder", async ({ page }) => {
    await page.goto("/dashboard/settings");
    await page.getByRole("tab", { name: /sms & reminders/i }).click();

    // Verify initial reminder
    await expect(page.getByText("1 hour before")).toBeVisible();

    // Click Edit on the card (Need to find the edit button inside the card)
    await page.getByRole("button", { name: /edit/i }).first().click();
    await expect(page.getByRole("heading", { name: "Edit Reminder" })).toBeVisible();

    // Verify current values
    await expect(page.getByLabel(/hours/i)).toHaveValue("1");

    // Mock successful update
    await page.route("**/api/reminder-configs/*", async (route) => {
      if (route.request().method() === "PUT" || route.request().method() === "PATCH") {
        await route.fulfill({
          status: 200,
          json: {
            success: true,
            message: "Reminder config updated",
          },
        });
      }
    });

    // Change hours to 3
    await page.getByLabel(/hours/i).fill("3");

    // Final save button
    await page.getByRole("button", { name: "Save Changes" }).click();

    await expect(page.getByText("Reminder config updated")).toBeVisible();
  });

  test("deletes an existing reminder", async ({ page }) => {
    await page.goto("/dashboard/settings");
    await page.getByRole("tab", { name: /sms & reminders/i }).click();

    // Click Delete on the card
    await page
      .getByRole("button", { name: /delete/i })
      .first()
      .click();

    // Alert Dialog should appear
    await expect(page.getByRole("heading", { name: "Delete Reminder" })).toBeVisible();

    // Mock successful deletion
    await page.route("**/api/reminder-configs/*", async (route) => {
      if (route.request().method() === "DELETE") {
        await route.fulfill({
          status: 200,
          json: {
            success: true,
            message: "Reminder config deleted",
          },
        });
      }
    });

    // Click Delete in the dialog
    await page.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(page.getByText("Reminder config deleted")).toBeVisible();
  });
});
