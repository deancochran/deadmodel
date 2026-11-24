import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('size guide opens independently of the order and always shows the Small sample', async ({
  page,
}) => {
  await page.goto('./')
  const trigger = page.getByRole('button', { name: 'Size guide', exact: true })
  const guide = page.getByRole('dialog', { name: 'Size guide' })
  await trigger.click()
  await expect(guide.getByRole('heading', { name: 'ADA denim · Size Small' })).toBeVisible()
  await expect(guide.getByRole('columnheader', { name: 'Inches' })).toBeVisible()
  const rows = guide.locator('tbody tr')
  await expect(rows).toHaveCount(9)
  const expectedMeasurements = [
    ['Waist width', '14.5'],
    ['Front rise', '6.75'],
    ['Back rise', '11.25'],
    ['Hip width', '19.5'],
    ['Thigh width', '10.5'],
    ['Knee width', '7.2'],
    ['Leg opening width', '10.75'],
    ['Inseam', '36'],
    ['Length', '40.75'],
  ] as const
  for (const [i, [label, value]] of expectedMeasurements.entries()) {
    await expect(rows.nth(i).getByRole('rowheader')).toContainText(label)
    await expect(rows.nth(i).getByRole('cell')).toHaveText(value)
  }
  await expect(guide).toContainText('33 cm below crotch')
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
