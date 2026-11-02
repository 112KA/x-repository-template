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

  test("末尾スラッシュ付きのサブページに直接アクセスして再読み込みできること", async ({ page }) => {
    const response = await page.goto("/sub/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL("/sub/");
    await expect(page.getByRole("heading", { name: "サブページ" })).toBeVisible();

    const reloadedResponse = await page.reload();
    expect(reloadedResponse?.status()).toBe(200);
    await expect(page).toHaveURL("/sub/");
    await expect(page.getByRole("heading", { name: "サブページ" })).toBeVisible();
  });

  test("トップページとサブページを切り替えられること", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (exception) => pageErrors.push(exception));

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle("app-vite");
    await expect(page.getByRole("heading", { name: "トップページ" })).toBeVisible();
    const navigation = page.getByRole("navigation", { name: "メインナビゲーション" });
    await expect(navigation).toHaveAttribute("data-slot", "navigation-menu");
    await expect(navigation.getByRole("listitem")).toHaveCount(2);
    await expect(navigation.getByRole("button")).toHaveCount(0);
    const subPageLink = navigation.getByRole("link", { name: "サブページ" });
    await expect(subPageLink).toHaveAttribute("data-slot", "navigation-menu-link");
    await expect(subPageLink).toHaveAttribute("href", "/sub/");
    await subPageLink.click();
    await expect(page).toHaveURL("/sub/");
    await expect(page.getByRole("heading", { name: "サブページ" })).toBeVisible();

    await navigation.getByRole("link", { name: "トップページ" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "トップページ" })).toBeVisible();
    expect(pageErrors).toHaveLength(0);
  });
});
