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

    const menuButton = page.getByRole("button", {
      name: /メニューを(開く|閉じる)/,
      includeHidden: true,
    });
    await expect(menuButton).toBeVisible();
    await expect(page.locator('body > [data-slot="sheet-trigger"]')).toHaveCount(1);
    const buttonElement = await menuButton.elementHandle();
    await expect(menuButton).toHaveAttribute("aria-label", "メニューを開く");
    await expect(menuButton).toHaveCSS("position", "fixed");
    await expect(menuButton).toHaveCSS("z-index", "60");
    await menuButton.click();
    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("navigation", { name: "メインナビゲーション" })).toBeVisible();
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
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.getByRole("switch", { name: "ダークモード" })).toHaveCount(0);
    await page.getByRole("button", { name: "メニューを開く" }).click();

    const sheet = page.getByRole("dialog");
    const themeSwitch = sheet.getByRole("switch", { name: "ダークモード" });
    await expect(themeSwitch).toBeVisible();
    await expect(themeSwitch.locator("svg.lucide-sun")).toBeVisible();
    await themeSwitch.click();
    await expect(themeSwitch).toBeChecked();
    await expect(themeSwitch.locator("svg.lucide-moon")).toBeVisible();
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
    await expect(desktopSwitch.locator("svg.lucide-sun")).toBeVisible();

    await page.setViewportSize({ width: 375, height: 812 });
    await page.getByRole("button", { name: "メニューを開く" }).click();
    await expect(themeSwitch).not.toBeChecked();
  });

  for (const theme of ["light", "dark"]) {
    test(`保存済みテーマ「${theme}」があっても React 起動前はライトで表示すること`, async ({
      page,
    }) => {
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
      await page.route("**/*", (route) => {
        const request = route.request();
        if (request.resourceType() === "script") {
          return route.abort();
        }
        return route.continue();
      });

      await page.goto("/");

      await expect(page.locator('script[src="/theme-init.js"]')).toHaveCount(0);
      await expect(page.locator("html")).not.toHaveClass(/dark/);
      await expect(page.locator('body > [data-slot="sheet-trigger"]')).toHaveCount(0);
    });

    test(`保存済みのテーマ「${theme}」をページ表示時に反映すること`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
      await page.emulateMedia({ colorScheme: theme === "dark" ? "light" : "dark" });
      await page.goto("/");

      const isDark = theme === "dark";
      await expect(page.locator("html")).toHaveClass(isDark ? /dark/ : /light/);
      await expect(
        page.getByRole("banner").getByRole("switch", { name: "ダークモード" }),
      ).toBeChecked({ checked: isDark });
    });
  }

  test("テーマの変更が画面遷移と再読み込み後も維持されること", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    // portal の生成を待ち、hydration 完了後に操作する。
    await expect(page.locator('body > [data-slot="sheet-trigger"]')).toHaveCount(1);
    const themeSwitch = page.getByRole("banner").getByRole("switch", { name: "ダークモード" });

    for (const theme of ["dark", "light"]) {
      const isDark = theme === "dark";
      await themeSwitch.click();
      await expect(themeSwitch).toBeChecked({ checked: isDark });
      expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(theme);

      await page
        .getByRole("navigation", { name: "メインナビゲーション" })
        .getByRole("link", { name: "サブページ" })
        .click();
      await expect(page).toHaveURL("/sub/");
      await expect(themeSwitch).toBeChecked({ checked: isDark });

      await page.reload();
      await expect(page.locator('body > [data-slot="sheet-trigger"]')).toHaveCount(1);
      await expect(themeSwitch).toBeChecked({ checked: isDark });
      await expect(page.locator("html")).toHaveClass(isDark ? /dark/ : /light/);
    }
  });

  test("テーマの保存に失敗した場合はエラーを通知し表示と共有状態を変更しないこと", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator('body > [data-slot="sheet-trigger"]')).toHaveCount(1);
    await page.evaluate(() => {
      Storage.prototype.setItem = () => {
        throw new DOMException("設定を保存できません。", "QuotaExceededError");
      };
    });

    const error = page.waitForEvent("pageerror");
    const themeSwitch = page.getByRole("banner").getByRole("switch", { name: "ダークモード" });
    await themeSwitch.click();

    expect((await error).message).toContain("設定を保存できません。");
    await expect(themeSwitch).not.toBeChecked();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`未設定のテーマはシステムの「${colorScheme}」を使用すること`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/");

      const themeSwitch = page.getByRole("banner").getByRole("switch", { name: "ダークモード" });
      await expect(page.locator('body > [data-slot="sheet-trigger"]')).toHaveCount(1);
      await expect(themeSwitch).toBeChecked({ checked: colorScheme === "dark" });
      await expect(page.locator("html")).toHaveClass(colorScheme);
      expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();

      await page.emulateMedia({ colorScheme: colorScheme === "dark" ? "light" : "dark" });
      await expect(page.locator("html")).toHaveClass(colorScheme);
      await themeSwitch.click();
      const selectedTheme = colorScheme === "dark" ? "light" : "dark";
      await expect(page.locator("html")).toHaveClass(selectedTheme);
      expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(selectedTheme);

      await page.emulateMedia({ colorScheme });
      await page.reload();
      await expect(themeSwitch).toBeChecked({ checked: selectedTheme === "dark" });
      await expect(page.locator("html")).toHaveClass(selectedTheme);
    });

    test(`以前保存したテーマ system はデバイスの「${colorScheme}」を初期値として扱うこと`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.addInitScript(() => localStorage.setItem("theme", "system"));
      await page.goto("/");
      await expect(page.locator("html")).toHaveClass(colorScheme);
      await expect(
        page.getByRole("banner").getByRole("switch", { name: "ダークモード" }),
      ).toBeChecked({ checked: colorScheme === "dark" });
    });
  }
});
