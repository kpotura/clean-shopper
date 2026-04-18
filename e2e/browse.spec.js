import { test, expect } from '@playwright/test'
import { signIn } from './helpers/sign-in.js'

const FILTER_CATEGORY = 'Personal Care'

test.describe('browse flow', () => {

  test.beforeEach(async ({ page }) => {
    await signIn(page)
    await expect(page.getByRole('heading', { name: 'Browse Products' })).toBeVisible()
  })

  test('products load into the grid', async ({ page }) => {
    // h4 headings only appear on real cards, not skeletons
    await expect(page.getByRole('heading', { level: 4 }).first()).toBeVisible({ timeout: 10000 })

    const cards = page.getByRole('heading', { level: 4 })
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('category filter narrows the grid', async ({ page }) => {
    // Wait for the initial grid to load
    await expect(page.getByRole('heading', { level: 4 }).first()).toBeVisible({ timeout: 10000 })
    const totalCount = await page.getByRole('heading', { level: 4 }).count()

    if (totalCount === 0) {
      test.skip(true, 'No products in the database — seed the products table to run this test.')
      return
    }

    // Click the category filter
    await page.getByRole('button', { name: FILTER_CATEGORY }).click()
    await page.waitForTimeout(400)

    const filteredCount = await page.getByRole('heading', { level: 4 }).count()

    // Filtered count must be strictly less than total — Personal Care is a
    // known subset of the full catalogue, so the filter must reduce the grid.
    expect(filteredCount).toBeLessThan(totalCount)
  })

  test('all-category filter shows all products', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 4 }).first()).toBeVisible({ timeout: 10000 })
    const totalCount = await page.getByRole('heading', { level: 4 }).count()

    await page.getByRole('button', { name: FILTER_CATEGORY }).click()
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: 'All' }).click()
    await page.waitForTimeout(400)

    const restoredCount = await page.getByRole('heading', { level: 4 }).count()
    expect(restoredCount).toBe(totalCount)
  })

})
