import { expect, test } from '@playwright/test'

test.describe('ADA garment gallery', () => {
  test('selects photos and keeps the hero and thumbnail states in sync', async ({ page }) => {
    await page.goto('./')

    const gallery = page.locator('.ada-gallery')
    const hero = gallery.getByRole('button', { name: 'Enlarge full length photograph' })

    await expect(hero.getByRole('img')).toHaveAttribute('alt', /Front of the ADA jean/)
    await expect(gallery.locator('[aria-live]').first()).toHaveText('01 / 04')

    await gallery.getByRole('button', { name: 'Show fringe detail' }).click()

    await expect(gallery.getByRole('button', { name: 'Show fringe detail' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(gallery.getByRole('button', { name: 'Show full length' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    await expect(
      gallery.getByRole('button', { name: 'Enlarge fringe detail photograph' }),
    ).toBeVisible()
    await expect(gallery.locator('[aria-live]').first()).toHaveText('03 / 04')
  })

  test('provides a named lightbox with wraparound navigation and restores focus', async ({
    page,
  }) => {
    await page.goto('./')

    const gallery = page.locator('.ada-gallery')
    const hero = gallery.getByRole('button', { name: 'Enlarge full length photograph' })
    await hero.focus()
    await hero.click()

    const lightbox = page.getByRole('dialog', { name: /^ADA \// })
    await expect(lightbox).toBeVisible()
    await expect(lightbox.getByRole('heading')).toHaveText('ADA / Full length')
    await expect(lightbox.getByRole('button', { name: 'Close photograph' })).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(lightbox.getByRole('button', { name: 'Next photograph' })).toBeFocused()

    await page.keyboard.press('ArrowLeft')
    await expect(lightbox.getByRole('heading')).toHaveText('ADA / Flared hem')
    await expect(lightbox.getByText('04 / 04')).toBeVisible()

    await page.keyboard.press('ArrowRight')
    await expect(lightbox.getByRole('heading')).toHaveText('ADA / Full length')

    await page.keyboard.press('Escape')
    await expect(lightbox).toBeHidden()
    await expect(hero).toBeFocused()
  })

  test('closes the lightbox from its backdrop', async ({ page }) => {
    await page.goto('./')
    await page.getByRole('button', { name: 'Enlarge full length photograph' }).click()

    const lightbox = page.getByRole('dialog', { name: /^ADA \// })
    await expect(lightbox).toBeVisible()
    await page.locator('[data-slot="dialog-overlay"]').click({ position: { x: 5, y: 5 } })
    await expect(lightbox).toBeHidden()
  })
})
