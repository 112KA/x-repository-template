import { expect, test } from "@playwright/test";

test.describe("React Routerのフレームワークモードのスモークテスト", () => {
  test("SVGをfaviconとして設定し配信できること", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/vite.svg");
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute("type", "image/svg+xml");
    const faviconResponse = await page.request.get("/vite.svg");
    expect(faviconResponse.status()).toBe(200);
    expect(faviconResponse.headers()["content-type"]).toContain("image/svg+xml");
  });

  test("トップページとサブページを切り替えられること", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (exception) => pageErrors.push(exception));

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle("app-vite");
    await expect(page.getByRole("heading", { name: "トップページ" })).toBeVisible();
    const counter = page.getByRole("button", { name: "count is 0" });
    await counter.click();
    await expect(page.getByRole("button", { name: "count is 1" })).toBeVisible();

    await page.getByRole("link", { name: "サブページ" }).click();
    await expect(page).toHaveURL(/\/sub$/);
    await expect(page.getByRole("heading", { name: "サブページ" })).toBeVisible();

    await page.getByRole("link", { name: "トップページ" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "トップページ" })).toBeVisible();
    expect(pageErrors).toHaveLength(0);
  });
});
