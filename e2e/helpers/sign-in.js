import { expect } from '@playwright/test'

/**
 * Signs in and waits for the NavBar to confirm the session is active.
 * Reads credentials from E2E_EMAIL / E2E_PASSWORD env vars.
 *
 * Set them before running:
 *   E2E_EMAIL=you@example.com E2E_PASSWORD=yourpass npx playwright test
 */
export async function signIn(page) {
  const email = process.env.E2E_EMAIL
  const password = process.env.E2E_PASSWORD

  if (!email || !password) {
    throw new Error(
      'E2E_EMAIL and E2E_PASSWORD environment variables must be set to run authenticated tests.\n' +
      'Example: E2E_EMAIL=you@example.com E2E_PASSWORD=yourpass npx playwright test'
    )
  }

  await page.goto('/')
  // Wait for auth state to resolve (App renders null while checking session)
  await expect(page.getByLabel('Email')).toBeVisible({ timeout: 8000 })

  await page.getByLabel('Email').fill(email)
  await page.getByRole('textbox', { name: 'Password' }).fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()

  // NavBar appearing confirms the session was established
  await expect(page.getByRole('button', { name: 'Clean Shopper' })).toBeVisible({ timeout: 10000 })
}
