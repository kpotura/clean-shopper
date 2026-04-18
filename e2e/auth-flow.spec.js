import { test, expect } from '@playwright/test'

// Unique email per run so sign-ups never conflict
const TEST_EMAIL = `test-${Date.now()}@example.com`
const TEST_PASSWORD = 'TestPass123!'

test.describe('authentication flow', () => {

  test('sign-in page loads', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
  })

  test('navigate to sign-up page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Sign up' }).click()
    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible()
  })

  test('full auth flow: sign up → browse → sign out → sign in', async ({ page }) => {
    // ── 1. Sign up ────────────────────────────────────────────────────────────
    await page.goto('/')
    await page.getByRole('button', { name: 'Sign up' }).click()
    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible()

    await page.getByLabel('Email').fill(TEST_EMAIL)
    await page.getByRole('textbox', { name: 'Password' }).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Create account' }).click()

    // ── 2. Wait for Supabase to respond, then detect which outcome occurred ───
    // Three possible outcomes after clicking "Create account":
    //   a) NavBar appears         → no email confirmation, test can continue
    //   b) "Check your email"     → email confirmation required, skip with note
    //   c) Inline error message   → rate limit, bad credentials, etc., skip with note
    //
    // To run the full flow: disable "Confirm email" in Supabase Auth settings
    // (Dashboard → Authentication → Providers → Email).

    // Wait for the submit button to re-enable — signals the API call resolved
    await expect(page.getByRole('button', { name: 'Create account' }))
      .not.toHaveAttribute('disabled', { timeout: 10000 })

    const errorText = await page.locator('.text-error').textContent({ timeout: 500 }).catch(() => null)
    if (errorText) {
      test.skip(true, `Supabase returned an error during sign-up: "${errorText.trim()}". Check rate limits or Auth settings.`)
      return
    }

    const emailConfirmRequired = await page
      .getByRole('heading', { name: 'Check your email' })
      .isVisible()
    if (emailConfirmRequired) {
      test.skip(true, 'Supabase email confirmation is enabled — disable it to run the full flow.')
      return
    }

    // ── 3. Verify browse page after sign-up ──────────────────────────────────
    await expect(page.getByRole('button', { name: 'Clean Shopper' })).toBeVisible({ timeout: 8000 })
    await expect(page.getByRole('button', { name: 'Browse' })).toBeVisible()

    // ── 4. Sign out ──────────────────────────────────────────────────────────
    await page.getByRole('button', { name: 'Sign out' }).click()
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible({ timeout: 5000 })

    // ── 5. Sign in with same credentials ─────────────────────────────────────
    await page.getByLabel('Email').fill(TEST_EMAIL)
    await page.getByRole('textbox', { name: 'Password' }).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Sign in' }).click()

    // ── 6. Verify browse page after sign-in ──────────────────────────────────
    await expect(page.getByRole('button', { name: 'Clean Shopper' })).toBeVisible({ timeout: 8000 })
    await expect(page.getByRole('button', { name: 'Browse' })).toBeVisible()
  })

})
