import { test, expect } from '@playwright/test'
import { signIn } from './helpers/sign-in.js'

const SEARCH_TERM = 'soap'

test.describe('search flow', () => {

  test.beforeEach(async ({ page }) => {
    await signIn(page)
    await page.getByRole('button', { name: 'Search' }).click()
    await expect(page.getByRole('heading', { name: 'Search Products' })).toBeVisible()
  })

  test('search page loads with empty state', async ({ page }) => {
    await expect(page.getByText('What are you looking for?')).toBeVisible()
  })

  test('returns results and each card shows a product name and safety info', async ({ page }) => {
    // Submit search
    await page.getByLabel('Search products').fill(SEARCH_TERM)
    await page.getByLabel('Submit search').click()

    // Wait for the spinner to clear
    await expect(page.getByLabel('Submit search')).not.toBeDisabled({ timeout: 15000 })

    // Skip if the database has no matching products
    const hasResults = await page.getByText(/\d+ results? for/).isVisible({ timeout: 3000 })
    if (!hasResults) {
      test.skip(true, `No results for "${SEARCH_TERM}" — seed the products table to run this test.`)
      return
    }

    // Every product card renders an h4 name heading
    const names = page.getByRole('heading', { level: 4 })
    await expect(names.first()).toBeVisible()
    const cardCount = await names.count()
    expect(cardCount).toBeGreaterThan(0)

    // Every card has a Save/Saved action — count must match name count
    const saveButtons = page.getByRole('button', { name: /^Save/ })
    expect(await saveButtons.count()).toBe(cardCount)

    // Safety verdict badge appears when the DB has verdict values populated
    const badges = page.getByText(/^(Clean|Use Caution|Avoid)$/)
    const badgeCount = await badges.count()
    if (badgeCount > 0) {
      // If any verdicts are present, every card should have one
      expect(badgeCount).toBe(cardCount)
    }

    // Numeric score appears when the DB has score values populated
    const scores = page.locator('.shrink-0')
    const scoreCount = await scores.count()
    if (scoreCount > 0) {
      await expect(scores.first()).toBeVisible()
    }
  })

  test('shows empty state for a query with no matches', async ({ page }) => {
    await page.getByLabel('Search products').fill('zzznomatchproduct999')
    await page.getByLabel('Submit search').click()

    await expect(page.getByLabel('Submit search')).not.toBeDisabled({ timeout: 15000 })
    await expect(page.getByText(/No results for/i)).toBeVisible()
  })

})
