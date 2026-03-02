import { test, expect } from "@playwright/test";

test("has title and login options", async ({ page }) => {
  // Navigate to login page
  await page.goto("/login");

  // Verify the page title (assuming it has Orasa in metadata)
  await expect(page).toHaveTitle(/.*Orasa.*/);

  // Expect a sign in button for google
  await expect(page.getByRole("button", { name: /sign in with google/i })).toBeVisible();
});
