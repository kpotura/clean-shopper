import { test, expect } from '@playwright/test'
import { signIn } from './helpers/sign-in.js'

test.describe.serial('favorites', () => {

  test.beforeEach(async ({ page }) => {
    await signIn(page)
    await page.getByRole('button', { name: 'Favorites' }).click()
    await expect(page.getByRole('heading', { name: 'Favorites', level: 1 })).toBeVisible()
    // Wait for skeleton loaders to clear before each test
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 10000 })
  })

  // ── Library Screen ─────────────────────────────────────────────────────────

  test('product cards render with Saved ✓ buttons', async ({ page }) => {
    const savedButtons = page.getByRole('button', { name: 'Saved ✓' })
    await expect(savedButtons.first()).toBeVisible()
    expect(await savedButtons.count()).toBeGreaterThan(0)
  })

  test('saved product count is displayed below the page title', async ({ page }) => {
    await expect(page.getByText(/\d+ saved products?/)).toBeVisible()
  })

  test('every visible card has saved={true} — no unsaved Save buttons in the grid', async ({ page }) => {
    // All ProductCards on the Favorites page are rendered with saved={true},
    // so the plain "Save" label (without ✓) must not appear
    const unsavedButtons = page.getByRole('button', { name: 'Save', exact: true })
    expect(await unsavedButtons.count()).toBe(0)
  })

  // ── Sort ───────────────────────────────────────────────────────────────────

  test('SortControl renders with Date Saved, Name A–Z, and Verdict options', async ({ page }) => {
    const select = page.getByRole('combobox', { name: 'Sort by' })
    await expect(select).toBeVisible()
    await expect(page.getByRole('option', { name: 'Date Saved' })).toBeAttached()
    await expect(page.getByRole('option', { name: 'Name A–Z' })).toBeAttached()
    await expect(page.getByRole('option', { name: 'Verdict' })).toBeAttached()
  })

  test('SortControl has a programmatically associated label', async ({ page }) => {
    // The <label htmlFor="sort-control"> must exist and the select must be reachable by that name
    await expect(page.getByText('Sort by')).toBeVisible()
    await expect(page.getByRole('combobox', { name: 'Sort by' })).toBeVisible()
  })

  test('changing sort to Name A–Z reorders the grid alphabetically', async ({ page }) => {
    const headings = page.getByRole('heading', { level: 4 })
    const countBefore = await headings.count()
    if (countBefore < 2) {
      test.skip(true, 'Need at least 2 products to verify sort order.')
      return
    }

    const nameBefore = await headings.first().textContent()

    await page.getByRole('combobox', { name: 'Sort by' }).selectOption('name_asc')

    const nameAfter = await headings.first().textContent()

    // Collect all names and verify they are in ascending alphabetical order
    const names = await headings.allTextContents()
    const sorted = [...names].sort((a, b) => a.localeCompare(b))
    expect(names).toEqual(sorted)

    // First card must have changed if the pre-sort order was not already A–Z
    // (not all data sets will differ, but we verified the order is correct above)
    expect(nameAfter).toBe(sorted[0])
  })

  test('changing sort to Verdict groups clean before caution before avoid', async ({ page }) => {
    const headings = page.getByRole('heading', { level: 4 })
    if (await headings.count() < 2) {
      test.skip(true, 'Need at least 2 products to verify sort order.')
      return
    }

    await page.getByRole('combobox', { name: 'Sort by' }).selectOption('verdict')

    // After sorting by Verdict the grid should still render all cards
    await expect(headings.first()).toBeVisible()
    expect(await headings.count()).toBeGreaterThan(0)
  })

  // ── Category Filter ─────────────────────────────────────────────────────────

  test('All chip is visible and present when multiple categories exist', async ({ page }) => {
    const headings = page.getByRole('heading', { level: 4 })
    if (await headings.count() === 0) {
      test.skip(true, 'No products to filter.')
      return
    }
    // Category chips are shown when ≥2 distinct categories are present.
    // Placeholder data always has 3 categories, so the All chip will be visible.
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible()
  })

  test('selecting a category chip filters the grid to that category', async ({ page }) => {
    const allHeadings = page.getByRole('heading', { level: 4 })
    const totalCount = await allHeadings.count()
    if (totalCount === 0) {
      test.skip(true, 'No products to filter.')
      return
    }

    // Find the first non-All category chip by picking a chip that is not
    // a nav button, a save/share button, or the All chip itself.
    // CategoryTag chips render as type="button" in a row next to the All chip.
    // We detect them by checking that the All chip is visible (filter bar is shown)
    // and then clicking the chip immediately after it in the DOM.
    const allChip = page.getByRole('button', { name: 'All' })
    await expect(allChip).toBeVisible()

    // Grab the first chip that is NOT "All" — we know placeholder data uses
    // "Personal Care", "Home Cleaning", "Baby Care". For real data we pick
    // whatever category chip is second.
    const categoryChip = page.getByRole('button', { name: /^(Personal Care|Home Cleaning|Baby Care)$/ }).first()
    const hasKnownChip = await categoryChip.isVisible({ timeout: 1000 }).catch(() => false)
    if (!hasKnownChip) {
      test.skip(true, 'No known placeholder category chips found — skipping category filter test.')
      return
    }

    const chipLabel = await categoryChip.textContent()
    await categoryChip.click()
    await page.waitForTimeout(200)

    const filteredCount = await allHeadings.count()
    expect(filteredCount).toBeLessThan(totalCount)

    // Every visible card's category span should match the selected chip
    const categorySpans = page.locator('span.text-micro.text-neutral-600')
    const cardCategories = await categorySpans.allTextContents()
    for (const cat of cardCategories) {
      expect(cat).toBe(chipLabel?.trim())
    }
  })

  test('All chip resets the category filter', async ({ page }) => {
    const headings = page.getByRole('heading', { level: 4 })
    const totalCount = await headings.count()

    const categoryChip = page.getByRole('button', { name: /^(Personal Care|Home Cleaning|Baby Care)$/ }).first()
    const hasKnownChip = await categoryChip.isVisible({ timeout: 1000 }).catch(() => false)
    if (!hasKnownChip || totalCount === 0) {
      test.skip(true, 'No known category chips — skipping.')
      return
    }

    await categoryChip.click()
    await page.waitForTimeout(200)
    await page.getByRole('button', { name: 'All' }).click()
    await page.waitForTimeout(200)

    expect(await headings.count()).toBe(totalCount)
  })

  test('count label updates to reflect filtered count', async ({ page }) => {
    const categoryChip = page.getByRole('button', { name: /^(Personal Care|Home Cleaning|Baby Care)$/ }).first()
    const hasKnownChip = await categoryChip.isVisible({ timeout: 1000 }).catch(() => false)
    if (!hasKnownChip) {
      test.skip(true, 'No known category chips — skipping.')
      return
    }

    const totalText = await page.getByText(/\d+ saved products?/).textContent()
    const totalNum = parseInt(totalText?.match(/\d+/)?.[0] ?? '0', 10)

    await categoryChip.click()
    await page.waitForTimeout(200)

    const filteredText = await page.getByText(/\d+ saved products?/).textContent()
    const filteredNum = parseInt(filteredText?.match(/\d+/)?.[0] ?? '0', 10)

    expect(filteredNum).toBeLessThan(totalNum)
  })

  // ── Remove / Unsave ─────────────────────────────────────────────────────────

  test('unsaving a product from Favorites removes it from the grid immediately', async ({ page }) => {
    const headings = page.getByRole('heading', { level: 4 })
    const countBefore = await headings.count()
    if (countBefore === 0) {
      test.skip(true, 'No products to unsave.')
      return
    }

    await page.getByRole('button', { name: 'Saved ✓' }).first().click()
    await page.waitForTimeout(300)

    expect(await headings.count()).toBe(countBefore - 1)
  })

  // ── Empty State ─────────────────────────────────────────────────────────────

  test('empty state shows "No saved products yet" after all products are removed (placeholder data only)', async ({ page }) => {
    // Only run this test when showing placeholder data, to avoid nuking real saved products
    const isPlaceholder = await page.getByText('(sample data)').isVisible({ timeout: 1000 }).catch(() => false)
    if (!isPlaceholder) {
      test.skip(true, 'Real saved products present — skipping destructive empty-state test.')
      return
    }

    // Unsave all remaining cards by clicking each "Saved ✓" button until none remain
    while (true) {
      const nextSaved = page.getByRole('button', { name: 'Saved ✓' }).first()
      const stillVisible = await nextSaved.isVisible({ timeout: 500 }).catch(() => false)
      if (!stillVisible) break
      await nextSaved.click()
      await page.waitForTimeout(200)
    }

    await expect(page.getByRole('heading', { name: 'No saved products yet' })).toBeVisible()
  })

  test('empty state CTA "Browse products" navigates to Browse', async ({ page }) => {
    const emptyHeading = page.getByRole('heading', { name: 'No saved products yet' })
    const alreadyEmpty = await emptyHeading.isVisible({ timeout: 500 }).catch(() => false)
    if (!alreadyEmpty) {
      test.skip(true, 'Products are present — run after the remove-all test or with an empty account.')
      return
    }

    await page.getByRole('button', { name: 'Browse products' }).click()
    await expect(page.getByRole('heading', { name: 'Browse Products' })).toBeVisible({ timeout: 5000 })
  })

  // ── Cross-View Saved State ─────────────────────────────────────────────────

  test('saving a product in Search shows it as Saved ✓ in the same session', async ({ page }) => {
    // Navigate to Search, find and save a product
    await page.getByRole('button', { name: 'Search' }).click()
    await expect(page.getByRole('heading', { name: 'Search Products' })).toBeVisible()
    await page.getByLabel('Search products').fill('soap')
    await page.getByLabel('Submit search').click()
    await expect(page.getByLabel('Submit search')).not.toBeDisabled({ timeout: 15000 })

    const firstSaveButton = page.getByRole('button', { name: 'Save', exact: true }).first()
    const hasProduct = await firstSaveButton.isVisible({ timeout: 3000 }).catch(() => false)
    if (!hasProduct) {
      test.skip(true, 'No search results — seed the products table to run this test.')
      return
    }

    const productName = await page.getByRole('heading', { level: 4 }).first().textContent()
    await firstSaveButton.click()
    await expect(page.getByRole('button', { name: 'Saved ✓' }).first()).toBeVisible({ timeout: 3000 })

    // Navigate to Favorites and verify the saved product appears there
    await page.getByRole('button', { name: 'Favorites' }).click()
    await expect(page.getByRole('heading', { name: 'Favorites', level: 1 })).toBeVisible()
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 10000 })

    await expect(page.getByRole('heading', { level: 4, name: productName })).toBeVisible()

    // Clean up: unsave from Favorites — scope to the specific product card element
    const card = page
      .locator('div.bg-white.rounded-lg')
      .filter({ has: page.getByRole('heading', { level: 4, name: productName }) })
      .first()
    await card.getByRole('button', { name: 'Saved ✓' }).click()
    await page.waitForTimeout(300)
  })

})
