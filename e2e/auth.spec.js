import { test, expect } from '@playwright/test'

test('shows sign-in page on load', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
})

test('shows sign-up link on sign-in page', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: /sign up/i }).or(
    page.getByText(/sign up/i)
  )).toBeVisible()
})
