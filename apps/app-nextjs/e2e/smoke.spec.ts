import { expect, test } from '@playwright/test'

test.describe('Smoke Test (Minimum Render Check)', () => {
  test('トップページがクラッシュせず表示されること', async ({ page }) => {
    // コンソールログで致命的な JS エラーが出ないかを監視
    const pageErrors: Error[] = []
    page.on('pageerror', exception => pageErrors.push(exception))

    // 該当画面へアクセス
    const response = await page.goto('https://localhost:3000/examples/transitions/')
    expect(response?.status()).toBe(200)

    await expect(page).toHaveTitle(/Next App/)
    expect(pageErrors).toHaveLength(0)

    await page.getByRole('button', { name: 'View 2へ移動' }).click()
    await page.getByRole('button', { name: 'View 3へ移動' }).click()
    await page.getByRole('link', { name: 'Page 2' }).click()
    await page.getByRole('link', { name: 'Page 1 へ移動' }).click()
    await page.getByRole('link', { name: '一覧へ戻る' }).click()
  })
})
