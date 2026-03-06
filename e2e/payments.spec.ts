import { test, expect } from "@playwright/test";

test.describe("Payment Flows (Subscription & SMS Credits)", () => {
  test.beforeEach(async ({ page }) => {
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

    await page.route("**/api/auth/me/roles", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: ["OWNER"],
        },
      });
    });

    // 2. Mock Business Profile (Active Subscription)
    await page.route("**/api/businesses/me*", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            id: "biz-1",
            name: "Orasa Clinic",
            subscriptionStatus: "ACTIVE",
            subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          },
        },
      });
    });

    // 3. Mock Preferences (SMS Balance)
    await page.route("**/api/users/me/preferences*", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            smsBalance: 150,
            emailNotifications: true,
            smsNotifications: false,
          },
        },
      });
    });

    // 4. Mock Payment History (Empty for simplicity)
    await page.route("**/api/payments/history*", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: [],
        },
      });
    });

    // 5. Mock other necessary endpoints for Settings Page load
    await page.route("**/api/branches", async (route) => {
      await route.fulfill({
        status: 200,
        json: { success: true, data: [{ id: "branch-1", name: "Main" }] },
      });
    });

    await page.route("**/api/branches/*/services*", async (route) => {
      await route.fulfill({
        status: 200,
        json: { success: true, data: [] },
      });
    });

    await page.route("**/api/reminder-configs*", async (route) => {
      await route.fulfill({
        status: 200,
        json: { success: true, data: [] },
      });
    });

    await page.route("**/api/staff*", async (route) => {
      await route.fulfill({
        status: 200,
        json: { success: true, data: { content: [], totalElements: 0 } },
      });
    });

    await page.route("**/api/appointments/stats*", async (route) => {
      await route.fulfill({
        status: 200,
        json: { success: true, data: { newAppointments: 0, previousAppointments: 0, growthPercentage: 0 } },
      });
    });

    // 6. Abort WebSockets to test REST fallback
    await page.route("**/api/ws/**", async (route) => {
      await route.abort();
    });

    // Logging for debug
    page.on("requestfailed", (request) => console.log("FAILED:", request.url(), request.failure()?.errorText));
    page.on("console", (msg) => {
      if (msg.type() === "error") console.log("PAGE ERROR:", msg.text());
    });
  });

  test("Owner can renew subscription successfully", async ({ page }) => {
    // 1. Mock the Subscription Payment Creation (Payloro QR)
    let createdPayload: unknown = null;
    await page.route("**/api/payments/subscription", async (route) => {
      if (route.request().method() === "POST") {
        createdPayload = route.request().postDataJSON();
      }
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            success: true,
            paymentLink: "https://mock-payloro.com/pay",
            paymentImage:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", // 1x1 fake img
            platOrderNo: "TEST-SUB-123",
            errorMessage: null,
          },
        },
      });
    });

    // 2. Mock the Payment Status Polling/Webhook success check
    // We delay it slightly so the UI shows the QR code before the success message kicks in
    await page.route("**/api/payments/status*", async (route) => {
      await page.waitForTimeout(1000);
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            merchantOrderNo: "SUB-XXX",
            status: "SUCCESS",
            type: "SUBSCRIPTION_RENEWAL",
          },
        },
      });
    });

    // 3. Navigate to Settings -> Billing
    await page.goto("/dashboard/settings");
    await page.getByRole("tab", { name: "Billing & Plans" }).click();

    // 4. Select 3 months and generate payment QR
    await page.getByRole("button", { name: "3 Mo" }).click();
    await page.getByRole("button", { name: "Generate Payment QR" }).click();

    // 6. Verify Payment Dialog opens and shows QR features
    await expect(page.getByRole("heading", { name: "Pay with QR Code" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Download QR Code" })).toBeVisible();
    await expect(page.getByText("TEST-SUB-123")).toBeVisible();

    // Trigger visibility change to force REST polling (Fallback mechanism)
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "visible",
        writable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    // 7. Verify the success state triggers automatically (due to our mocked /status returning SUCCESS)
    await expect(page.getByText("Payment Successful!", { exact: false })).toBeVisible();
    await expect(page.getByText("subscription has been renewed", { exact: false })).toBeVisible();

    // 8. Verify the payload sent to backend
    expect(createdPayload).toEqual({ months: 3 });
  });

  test("Owner can buy SMS credits successfully", async ({ page }) => {
    // 1. Mock the Credits Payment Creation
    let createdPayload: unknown = null;
    await page.route("**/api/payments/credits", async (route) => {
      if (route.request().method() === "POST") {
        createdPayload = route.request().postDataJSON();
      }
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            success: true,
            paymentLink: "https://mock-payloro.com/pay",
            paymentImage: "data:image/png;base64,mocked",
            platOrderNo: "TEST-SMS-456",
            errorMessage: null,
          },
        },
      });
    });

    // 2. Mock the Payment Status check
    await page.route("**/api/payments/status*", async (route) => {
      await page.waitForTimeout(1000);
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            merchantOrderNo: "CRD-XXX",
            status: "SUCCESS",
            type: "CREDIT_TOPUP",
          },
        },
      });
    });

    // 3. Navigate to Settings -> Billing
    await page.goto("/dashboard/settings");
    await page.getByRole("tab", { name: "Billing & Plans" }).click();

    // 4. Click Buy SMS Credits
    await page.getByRole("button", { name: "Refill Credits" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // 5. Fill out Credits Form
    const amountInput = page.getByRole("spinbutton");
    await amountInput.fill("500");

    await page.getByRole("button", { name: "Refill Credits" }).click();

    // 6. Verify Payment Dialog opens
    await expect(page.getByRole("heading", { name: "Pay with QR Code" })).toBeVisible();
    await expect(page.getByText("TEST-SMS-456")).toBeVisible();

    // Trigger visibility change to force REST polling
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "visible",
        writable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    // 7. Verify Success UI appears
    await page.waitForTimeout(1000);
    await expect(page.getByText("Payment Successful!", { exact: false })).toBeVisible();

    // 8. Verify payload
    expect(createdPayload).toEqual({ credits: 500, method: "gcash-qr" });
  });

  test("Owner sees error screen if payment fails or expires", async ({ page }) => {
    // 1. Mock the Payment Creation (valid generation)
    await page.route("**/api/businesses/me*", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            id: "biz-1",
            name: "Orasa Clinic",
            subscriptionStatus: "EXPIRED",
          },
        },
      });
    });

    await page.route("**/api/payments/subscription", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            success: true,
            paymentImage: "data:image/png;base64,mocked",
            platOrderNo: "TEST-FAIL-789",
            errorMessage: null,
          },
        },
      });
    });

    // 2. Mock the Payment Status returning FAILED
    await page.route("**/api/payments/status*", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            merchantOrderNo: "SUB-XXX",
            status: "FAILED",
            type: "SUBSCRIPTION_RENEWAL",
          },
        },
      });
    });

    // 3. Navigate and trigger flow
    await page.goto("/dashboard/settings");
    await page.getByRole("tab", { name: "Billing & Plans" }).click();

    await page.getByRole("button", { name: "1 Mo" }).click();
    await page.getByRole("button", { name: "Generate Payment QR" }).click();

    // 4. Verify Payment Dialog opens initially
    await expect(page.getByRole("heading", { name: "Pay with QR Code" })).toBeVisible();

    // Trigger visibility change to force REST polling
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "visible",
        writable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    // 5. Verify the Failure screen takes over
    await page.waitForTimeout(1000);
    await expect(page.getByText("Payment Failed", { exact: false })).toBeVisible();
    // Ensure the Download button disappears
    await expect(page.getByRole("button", { name: "Download QR Code" })).not.toBeVisible();
  });
});
