import { expect, test } from '@playwright/test'

test.describe('Smoke Test (Minimum Render Check)', () => {
  test('トップページがクラッシュせず表示されること', async ({ page }) => {
    const pageErrors: Error[] = []
    page.on('pageerror', exception => pageErrors.push(exception))

    const response = await page.goto('/')
    expect(response?.status()).toBe(200)

    await expect(page).toHaveTitle('Astro Basics')
    await expect(page.locator('main')).toBeVisible()
    expect(pageErrors).toHaveLength(0)
  })
})
