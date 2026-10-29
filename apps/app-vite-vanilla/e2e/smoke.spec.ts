import { expect, test } from "@playwright/test";

test.describe("Smoke Test (Minimum Render Check)", () => {
  test("トップページがクラッシュせずカウンターを操作できること", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (exception) => pageErrors.push(exception));

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle("app-vite-vanilla");
    await expect(page.getByRole("heading", { name: "Vite + TypeScript" })).toBeVisible();
    const counter = page.getByRole("button", { name: "count is 0" });
    await counter.click();
    await expect(page.getByRole("button", { name: "count is 1" })).toBeVisible();
    expect(pageErrors).toHaveLength(0);
  });
});
