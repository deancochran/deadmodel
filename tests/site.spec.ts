import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('static HTML', () => {
  test.use({ javaScriptEnabled: false })
  test('reads the production page without JavaScript', async ({ page }) => {
    await page.goto('./')
    await expect(page.getByRole('heading', { name: 'deadmodel', exact: true })).toBeVisible()
    await expect(page.locator('figcaption')).toContainText('Fold sequence')
    await expect(page.getByText('Enable JavaScript to edit the caption.')).toBeVisible()
    expect(
      await page.locator('header img').evaluate((img: HTMLImageElement) => img.naturalWidth),
    ).toBeGreaterThan(0)
  })
})

test('validates and updates the preview without navigation or a backend', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('./')
  const input = page.getByLabel('Plate caption')
  const apply = page.getByRole('button', { name: 'Apply caption' })
  await expect(apply).toBeEnabled()
  await page.context().setOffline(true)
  await input.fill('   ')
  await apply.click()
  await expect(page.getByRole('alert')).toHaveText('Enter a caption first.')
  await input.fill('X'.repeat(49))
  await expect(page.getByRole('alert')).toHaveText('Use 48 characters or fewer.')
  await input.fill('  Counterform  ')
  await input.press('Enter')
  await expect(page.locator('figcaption [aria-live]')).toHaveText('Counterform')
  await expect(page.getByRole('alert')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('fits the viewport and passes automated accessibility checks', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('button', { name: 'Apply caption' })).toBeEnabled()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  expect(result.violations).toEqual([])
})
