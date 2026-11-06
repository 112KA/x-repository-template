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

  test("スマートフォン幅ではメニューをシートで表示し、リンク選択で閉じること", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const pageErrors: Error[] = [];
    page.on("pageerror", (exception) => pageErrors.push(exception));
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /メニューを(開く|閉じる)/ });
    await expect(menuButton).toBeVisible();
    await expect(page.locator('body > [data-slot="sheet-trigger"]')).toHaveCount(1);
    const buttonElement = await menuButton.elementHandle();
    await expect(menuButton).toHaveAttribute("aria-label", "メニューを開く");
    await expect(menuButton).toHaveCSS("position", "fixed");
    await expect(menuButton).toHaveCSS("z-index", "60");
    await menuButton.click();
    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("heading", { name: "メニュー" })).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-label", "メニューを閉じる");
    expect(
      await menuButton.evaluate((button) => {
        const bounds = button.getBoundingClientRect();
        return button.contains(
          document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2),
        );
      }),
    ).toBe(true);
    expect(
      await menuButton.evaluate((button, original) => button === original, buttonElement),
    ).toBe(true);
    await menuButton.click();
    await expect(sheet).toBeHidden();

    await expect(menuButton).toHaveAttribute("aria-label", "メニューを開く");
    await menuButton.click();
    await expect(sheet).toBeVisible();
    await sheet.getByRole("link", { name: "サブページ" }).click();

    await expect(page).toHaveURL("/sub/");
    await expect(sheet).toBeHidden();
    expect(pageErrors).toHaveLength(0);
  });

  test("スマートフォンではシート内でテーマを変更でき、デスクトップ表示にも反映されること", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByRole("switch", { name: "ダークモード" })).toHaveCount(0);
    await page.getByRole("button", { name: "メニューを開く" }).click();

    const sheet = page.getByRole("dialog");
    const themeSwitch = sheet.getByRole("switch", { name: "ダークモード" });
    await expect(themeSwitch).toBeVisible();
    await themeSwitch.click();
    await expect(themeSwitch).toBeChecked();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(sheet).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await page.setViewportSize({ width: 1280, height: 800 });
    const desktopSwitch = page.getByRole("banner").getByRole("switch", { name: "ダークモード" });
    await expect(desktopSwitch).toBeVisible();
    await expect(desktopSwitch).toBeChecked();
    await desktopSwitch.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });
});
