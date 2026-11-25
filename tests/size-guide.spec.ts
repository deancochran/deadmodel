import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import guideContent from '../content/size-guide.json' with { type: 'json' }

test('size guide opens independently of the order and always shows the Small sample', async ({
  page,
}) => {
  await page.goto('./')
  const trigger = page.getByRole('button', { name: 'Size guide', exact: true })
  const guide = page.getByRole('dialog', { name: 'Size guide' })
  await trigger.click()
  await expect(guide.getByRole('heading', { name: /Size Small/ })).toBeVisible()
  await expect(guide.getByRole('columnheader', { name: 'Inches' })).toBeVisible()
  const rows = guide.locator('tbody tr')
  await expect(rows).toHaveCount(guideContent.measurements.length)
  for (const [i, measurement] of guideContent.measurements.entries()) {
    await expect(rows.nth(i).getByRole('rowheader')).toContainText(measurement.label)
    await expect(rows.nth(i).getByRole('cell')).toHaveText(String(measurement.inches))
    if ('note' in measurement && typeof measurement.note === 'string' && measurement.note)
      await expect(rows.nth(i)).toContainText(measurement.note)
  }
  await expect(guide).toContainText(guideContent.description)
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([])
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(page.getByRole('alert')).toHaveCount(0)

  const large = page.getByLabel('L quantity', { exact: true })
  await large.fill('2')
  await page.getByRole('radio', { name: 'Wholesale boutique' }).check()
  await trigger.click()
  await expect(guide.getByRole('table', { name: /size Small/i })).toBeVisible()
  await expect(guide.getByRole('combobox')).toHaveCount(0)
  await page.emulateMedia({ media: 'print' })
  await expect(guide).toBeHidden()
  await expect(trigger).toBeHidden()
  await page.emulateMedia({ media: 'screen' })
  await guide.getByRole('button', { name: 'Close size guide' }).click()
  await expect(large).toHaveValue('2')
  await expect(page.getByRole('radio', { name: 'Wholesale boutique' })).toBeChecked()
  await expect(page.locator('.ada-order-total')).toContainText('$140')
})
