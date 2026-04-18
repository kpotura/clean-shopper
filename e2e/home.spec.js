import { test, expect } from '@playwright/test'

test('home page loads without errors', async ({ page }) => {
  const consoleErrors = []
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', err => consoleErrors.push(err.message))

  await page.goto('/')
  await expect(page).toHaveTitle(/Clean Shopper/i)
  await expect(page.locator('#root')).not.toBeEmpty()

  expect(consoleErrors, `Console errors: ${consoleErrors.join('\n')}`).toHaveLength(0)
})
