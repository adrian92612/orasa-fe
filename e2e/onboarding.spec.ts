import { test, expect } from "@playwright/test";

test.describe("Critical Onboarding Flow", () => {
  test("Completes the full onboarding process", async ({ page }) => {
    // 1. Mock initial user auth without businessId
    let isBusinessCreated = false;

    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: {
            id: "user-1",
            email: "owner@orasa.ph",
            role: "OWNER",
            businessId: isBusinessCreated ? "biz-1" : null,
          },
        },
      });
    });

    // 2. Mock business creation
    await page.route("**/api/businesses", async (route) => {
      if (route.request().method() === "POST") {
        isBusinessCreated = true;
        await route.fulfill({
          status: 201,
          json: {
            success: true,
            data: {
              businessId: "biz-1",
              firstBranchId: "branch-1",
            },
          },
        });
      } else {
        await route.continue();
      }
    });

    // 3. Mock service creation
    await page.route("**/api/services", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          json: { success: true },
        });
      } else {
        await route.continue();
      }
    });

    // 4. Mock staff creation
    await page.route("**/api/staff", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          json: { success: true },
        });
      } else {
        await route.continue();
      }
    });

    // Start flow
    await page.goto("/onboarding");

    // --- STEP 1: TERMS AND CONDITIONS ---
    await expect(page.getByRole("heading", { name: "Terms and Conditions" })).toBeVisible();

    // Scroll the terms container to bottom
    await page.evaluate(() => {
      const scrollable = document.querySelector(".overflow-y-auto");
      if (scrollable) {
        scrollable.scrollTop = scrollable.scrollHeight;
        scrollable.dispatchEvent(new Event("scroll"));
      }
    });

    // Check the box and continue
    const termsCheckbox = page.getByRole("checkbox");
    await termsCheckbox.check();
    await page.getByRole("button", { name: "Continue" }).click();

    // --- STEP 2: BUSINESS ONBOARDING ---
    await expect(page.getByText("Register your business")).toBeVisible();
    await page.getByLabel("Business Name").fill("Orasa Demo Clinic");
    await page.getByLabel("Branch Name").fill("Main Branch");
    await page.getByLabel("Branch Address").fill("123 Main Street, Quezon City");
    await page.getByLabel("Branch Phone No.").fill("09123456789");
    await page.getByRole("button", { name: "Next Step" }).click();

    // --- STEP 3: SERVICE ONBOARDING ---
    await expect(page.getByText("Add your services")).toBeVisible();
    await page.getByLabel("Service Name").fill("Consultation");
    await page.getByLabel("Description").fill("Basic checkup");
    await page.getByLabel("Base Price").fill("500");
    await page.getByLabel("Duration (min)").fill("30");
    await page.getByRole("button", { name: "Create & Continue" }).click();

    // --- STEP 4: STAFF ONBOARDING ---
    await expect(page.getByText("Set up your team")).toBeVisible();
    await page.getByLabel("Username").fill("staff01");
    await page.locator("#temporaryPassword").fill("secret123");
    await page.locator("#confirmPassword").fill("secret123");
    await page.getByRole("button", { name: "Create & Finish" }).click();

    // --- FINAL REDIRECT ---
    await page.waitForURL(/.*\/dashboard\/analytics/);
    expect(page.url()).toMatch(/.*\/dashboard\/analytics/);
  });
});
