import { test, expect } from '@playwright/test'
import { signIn } from './helpers/sign-in.js'

const SEARCH_TERM = 'soap'

test.describe.serial('save to list', () => {

  test('save a product, verify Saved state, reload, verify it persists', async ({ page }) => {
    await signIn(page)

    // ── 1. Navigate to Search and find a product ──────────────────────────────
    await page.getByRole('button', { name: 'Search' }).click()
    await expect(page.getByRole('heading', { name: 'Search Products' })).toBeVisible()

    await page.getByLabel('Search products').fill(SEARCH_TERM)
    await page.getByLabel('Submit search').click()
    await expect(page.getByLabel('Submit search')).not.toBeDisabled({ timeout: 15000 })

    // ── 2. Capture the product name from the first card's h4 heading ──────────
    const firstCard = page.getByRole('heading', { level: 4 }).first()
    const hasProducts = await firstCard.isVisible({ timeout: 3000 })
    if (!hasProducts) {
      test.skip(true, `No results for "${SEARCH_TERM}" — seed the products table to run this test.`)
      return
    }
    const productName = await firstCard.textContent()

    // ── 3. Ensure the product is in unsaved state before saving ──────────────
    // The previous test (unsave) may have left this product in either state.
    const firstButton = page.getByRole('button', { name: /^Sav/ }).first()
    const buttonText = await firstButton.textContent()
    if (buttonText && buttonText.trim().startsWith('Saved')) {
      // Already saved — unsave it first so we get a clean 201 response on save
      await firstButton.click()
      await expect(page.getByRole('button', { name: 'Save' }).first()).toBeVisible({ timeout: 3000 })
    }

    // ── 4. Save the product ───────────────────────────────────────────────────
    const firstSave = page.getByRole('button', { name: 'Save' }).first()
    await firstSave.click()

    // Optimistic update flips the button immediately
    await expect(page.getByRole('button', { name: 'Saved' }).first()).toBeVisible({ timeout: 3000 })

    // Wait for the Supabase write to complete before reloading — the optimistic
    // update fires synchronously but the actual INSERT is async
    await page.waitForResponse(
      res => res.url().includes('saved_products') && res.status() === 201,
      { timeout: 5000 }
    )

    // ── 5. Reload — Supabase session persists via localStorage ───────────────
    await page.reload()
    await expect(page.getByRole('button', { name: 'Clean Shopper' })).toBeVisible({ timeout: 10000 })

    // ── 6. Re-search and verify the product is still Saved ───────────────────
    await page.getByRole('button', { name: 'Search' }).click()
    await page.getByLabel('Search products').fill(SEARCH_TERM)
    await page.getByLabel('Submit search').click()
    await expect(page.getByLabel('Submit search')).not.toBeDisabled({ timeout: 15000 })

    // Find the card that contains the saved product's h4 heading
    const savedCard = page
      .locator('div')
      .filter({ has: page.getByRole('heading', { level: 4, name: productName }) })
      .filter({ has: page.getByRole('button', { name: 'Saved' }) })
      .first()

    await expect(savedCard.getByRole('button', { name: 'Saved' })).toBeVisible({ timeout: 5000 })
  })

  test('unsaving a product removes the Saved state', async ({ page }) => {
    await signIn(page)

    await page.getByRole('button', { name: 'Search' }).click()
    await page.getByLabel('Search products').fill(SEARCH_TERM)
    await page.getByLabel('Submit search').click()
    await expect(page.getByLabel('Submit search')).not.toBeDisabled({ timeout: 15000 })

    // Use an already-Saved button if present; otherwise save one first
    let savedButton = page.getByRole('button', { name: 'Saved' }).first()
    const alreadySaved = await savedButton.isVisible({ timeout: 1000 }).catch(() => false)

    if (!alreadySaved) {
      const saveButton = page.getByRole('button', { name: 'Save' }).first()
      const hasProducts = await saveButton.isVisible({ timeout: 2000 }).catch(() => false)
      if (!hasProducts) {
        test.skip(true, `No results for "${SEARCH_TERM}" — seed the products table to run this test.`)
        return
      }
      await saveButton.click()
      await expect(page.getByRole('button', { name: 'Saved' }).first()).toBeVisible({ timeout: 3000 })
    }

    savedButton = page.getByRole('button', { name: 'Saved' }).first()
    await savedButton.click()

    await expect(page.getByRole('button', { name: 'Save' }).first()).toBeVisible({ timeout: 3000 })
  })

})
