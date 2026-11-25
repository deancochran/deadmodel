import { expect, test } from '@playwright/test'
import garment from '../content/ada.json' with { type: 'json' }

function photoAt(index: number) {
  const photo = garment.gallery[index]
  if (!photo) throw new Error(`Expected a gallery photo at index ${index}.`)
  return photo
}

test.describe('ADA garment gallery', () => {
  test('selects photos and keeps the hero and thumbnail states in sync', async ({ page }) => {
    await page.goto('./')

    const gallery = page.locator('.ada-gallery')
    const [firstPhoto, selectedPhoto] = [photoAt(0), photoAt(garment.gallery.length - 1)]
    const hero = gallery.getByRole('button', {
      name: `Enlarge ${garment.shortTitle}: ${firstPhoto.title.toLowerCase()} photograph`,
    })

    await expect(hero.getByRole('img')).toHaveAttribute('alt', firstPhoto.alt)
    for (const photo of garment.gallery) {
      const response = await page.request.get(`.${photo.image}`)
      expect(response.ok(), photo.image).toBe(true)
      expect(response.headers()['content-type']).toMatch(/^image\//)
    }
    const thumbs = gallery.locator('.ada-gallery__thumbs button')
    if (garment.gallery.length === 1) {
      await expect(thumbs).toHaveCount(0)
      return
    }
    await expect(gallery.locator('[aria-live]').first()).toHaveText(
      `01 / ${String(garment.gallery.length).padStart(2, '0')}`,
    )

    await thumbs.last().click()

    await expect(thumbs.last()).toHaveAttribute('aria-pressed', 'true')
    await expect(thumbs.first()).toHaveAttribute('aria-pressed', 'false')
    await expect(
      gallery.getByRole('button', {
        name: `Enlarge ${garment.shortTitle}: ${selectedPhoto.title.toLowerCase()} photograph`,
      }),
    ).toBeVisible()
    await expect(gallery.locator('[aria-live]').first()).toHaveText(
      `${String(garment.gallery.length).padStart(2, '0')} / ${String(garment.gallery.length).padStart(2, '0')}`,
    )
  })

  test('provides a named lightbox with wraparound navigation and restores focus', async ({
    page,
  }) => {
    await page.goto('./')

    const gallery = page.locator('.ada-gallery')
    const hero = gallery.getByRole('button', {
      name: `Enlarge ${garment.shortTitle}: ${photoAt(0).title.toLowerCase()} photograph`,
    })
    await hero.focus()
    await hero.click()

    const lightbox = page.getByRole('dialog')
    await expect(lightbox).toBeVisible()
    await expect(lightbox.getByRole('heading')).toHaveText(
      `${garment.shortTitle} / ${photoAt(0).title}`,
    )
    await expect(lightbox.getByRole('button', { name: 'Close photograph' })).toBeFocused()
    if (garment.gallery.length === 1) {
      await expect(lightbox.getByRole('button', { name: 'Next photograph' })).toHaveCount(0)
      await page.keyboard.press('Escape')
      await expect(hero).toBeFocused()
      return
    }
    await page.keyboard.press('Shift+Tab')
    await expect(lightbox.getByRole('button', { name: 'Next photograph' })).toBeFocused()

    await page.keyboard.press('ArrowLeft')
    await expect(lightbox.getByRole('heading')).toHaveText(
      `${garment.shortTitle} / ${photoAt(garment.gallery.length - 1).title}`,
    )
    await expect(
      lightbox.getByText(
        `${String(garment.gallery.length).padStart(2, '0')} / ${String(garment.gallery.length).padStart(2, '0')}`,
      ),
    ).toBeVisible()

    await page.keyboard.press('ArrowRight')
    await expect(lightbox.getByRole('heading')).toHaveText(
      `${garment.shortTitle} / ${photoAt(0).title}`,
    )

    await page.keyboard.press('Escape')
    await expect(lightbox).toBeHidden()
    await expect(hero).toBeFocused()
  })

  test('closes the lightbox from its backdrop', async ({ page }) => {
    await page.goto('./')
    await page
      .getByRole('button', {
        name: `Enlarge ${garment.shortTitle}: ${photoAt(0).title.toLowerCase()} photograph`,
      })
      .click()

    const lightbox = page.getByRole('dialog')
    await expect(lightbox).toBeVisible()
    await page.locator('[data-slot="dialog-overlay"]').click({ position: { x: 5, y: 5 } })
    await expect(lightbox).toBeHidden()
  })
})
