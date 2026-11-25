import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { PDFDocument } from 'pdf-lib'
import garment from '../content/ada.json' with { type: 'json' }
import brand from '../content/brand.json' with { type: 'json' }
import story from '../content/story.json' with { type: 'json' }

const path = './'
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

test('home is the shop; section links keep the order and stay in the same document', async ({
  page,
}) => {
  const failures: string[] = []
  page.on('response', (response) => {
    if (!response.ok() && response.status() >= 400) failures.push(response.url())
  })
  await page.goto('./')
  await expect(page).toHaveTitle(brand.pageTitle)
  const home = page.url()
  await page.getByLabel('M quantity', { exact: true }).fill('1')
  await page.locator('nav').getByRole('link', { name: story.sectionTitle, exact: true }).click()
  await expect(page).toHaveURL(`${home}#notes`)
  await expect
    .poll(() =>
      page
        .locator('#notes img')
        .evaluateAll((images) =>
          images.every((image) => image instanceof HTMLImageElement && image.naturalWidth > 0),
        ),
    )
    .toBe(true)
  const loaded = await page.evaluate(async () => {
    const faces = await document.fonts.load('16px "ADA Inter"')
    return faces.length > 0 && faces.every((face) => face.status === 'loaded')
  })
  expect(loaded).toBe(true)
  await page.getByRole('link', { name: 'Back to shop' }).click()
  await expect(page).toHaveURL(`${home}#shop`)
  await expect(page.getByLabel('M quantity', { exact: true })).toHaveValue('1')
  expect(failures).toEqual([])
})

test('the former product URL is not a separate page', async ({ request }) => {
  expect((await request.get('./buyer-sheet/')).status()).toBe(404)
})

test.describe('prerendered storefront', () => {
  test.use({ javaScriptEnabled: false })
  test('direct link serves the garment, price list, story and blank paper grid', async ({
    page,
  }) => {
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(brand.pageTitle)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      brand.pageDescription,
    )
    await expect(page.getByRole('heading', { level: 1 })).toContainText(garment.title)
    await expect(page.locator('.ada-intro')).toHaveText(garment.description)
    await expect(page.getByRole('heading', { name: story.heading })).toBeVisible()
    await expect(page.locator('.ada-story p')).toHaveText([story.opening, story.closing])
    const base = process.env.PAGES_BASE_PATH || ''
    const favicon = page.locator('link[rel="icon"]')
    await expect(favicon).toHaveAttribute('href', `${base}${brand.favicon}`)
    for (const [selector, image] of [
      ['.ada-masthead img', brand.wordmark],
      ['.ada-footer img', brand.wordmark],
      ['.ada-cards img:first-child', story.front],
      ['.ada-cards img:last-child', story.back],
    ] as const) {
      await expect(page.locator(selector)).toHaveAttribute('src', `${base}${image.image}`)
      await expect(page.locator(selector)).toHaveAttribute('alt', image.alt)
    }
    for (const image of [
      brand.wordmark.image,
      brand.favicon,
      story.front.image,
      story.back.image,
    ]) {
      const response = await page.request.get(`.${image}`)
      expect(response.status(), image).toBe(200)
      expect(response.headers()['content-type']).toMatch(/^image\//)
    }
    for (const detail of [garment.weight, garment.color, ...garment.style, ...garment.materials]) {
      await expect(page.locator('main')).toContainText(detail)
    }
    await expect(page.locator('main')).toContainText('$140')
    await expect(page.locator('main')).toContainText('$70')
    for (const size of ['XS', 'S', 'M', 'L']) {
      await expect(page.getByLabel(`${size} quantity`, { exact: true })).toHaveValue('')
    }
    const image = page.locator('.ada-gallery img:visible').first()
    expect(await image.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0)
  })
})

test('the buyer can change tier, review offline, edit and return to the same draft', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(path)
  const s = page.getByLabel('S quantity', { exact: true })
  const buy = page.getByRole('button', { name: /buy now/i })
  await expect(buy).toBeEnabled()
  await page.context().setOffline(true)
  await buy.click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('alert').first()).toBeVisible()
  await s.fill('1.5')
  await buy.click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(s).toHaveAttribute('aria-invalid', 'true')
  await s.fill('2')
  await page.getByLabel('L quantity', { exact: true }).fill('1')
  await buy.click()
  const panel = page.getByRole('dialog')
  await expect(panel).toContainText('$420')
  await expect(panel).toContainText(garment.shortTitle)
  await expect(panel.locator('img')).toHaveAttribute(
    'src',
    `${process.env.PAGES_BASE_PATH || ''}${garment.gallery[0]?.image}`,
  )
  await panel.getByRole('button', { name: /edit quantities/i }).click()
  await expect(s).toBeFocused()
  await page.getByRole('radio', { name: 'Wholesale boutique' }).check()
  await buy.click()
  await expect(panel).toContainText('Wholesale boutique')
  await expect(panel).toContainText('$210')
  await expect(panel).toContainText(/no payment/i)
  await page.setViewportSize({ width: 390, height: 640 })
  await expect(panel).toBeVisible()
  const mobilePanel = await panel.boundingBox()
  expect(mobilePanel?.width).toBe(390)
  await page.setViewportSize({ width: 1280, height: 720 })
  await expect(panel).toContainText('$210')
  const widePanel = await panel.boundingBox()
  expect(widePanel?.x).toBeGreaterThan(640)
  await page.keyboard.press('Escape')
  await expect(buy).toBeFocused()
  await expect(s).toHaveValue('2')
  expect(errors).toEqual([])
})

test('sheet and review meet automated accessibility and fit the viewport', async ({ page }) => {
  await page.goto(path)
  await expect(page.getByRole('button', { name: /^buy now/i })).toBeEnabled()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect((await new AxeBuilder({ page }).withTags(tags).analyze()).violations).toEqual([])
  await page.getByLabel('XS quantity', { exact: true }).fill('1')
  await page.getByRole('button', { name: /^buy now/i }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  expect((await new AxeBuilder({ page }).withTags(tags).analyze()).violations).toEqual([])
})

test('prints a single A4 and Letter sheet for blank and filled orders', async ({ page }, info) => {
  await page.goto(path)
  for (const filled of [false, true]) {
    if (filled) {
      await page.getByLabel('S quantity', { exact: true }).fill('2')
      await page.getByLabel('L quantity', { exact: true }).fill('1')
      await page.getByRole('radio', { name: 'Wholesale boutique' }).check()
      if (garment.gallery.length > 1)
        await page.locator('.ada-gallery__thumbs button').last().click()
    }
    await page.emulateMedia({ media: 'print' })
    await expect(page.locator('.ada-masthead img')).toBeVisible()
    await expect(page.locator('.ada-masthead img')).toHaveAttribute(
      'src',
      `${process.env.PAGES_BASE_PATH || ''}${brand.wordmark.image}`,
    )
    await expect(page.locator('.ada-notes')).toBeHidden()
    await expect(page.getByRole('button', { name: /^buy now/i })).toBeHidden()
    await expect(page.locator('.ada-gallery img:visible')).toHaveCount(1)
    expect(await page.locator('.ada-gallery img:visible').getAttribute('src')).toBe(
      `${process.env.PAGES_BASE_PATH || ''}${garment.gallery[0]?.image}`,
    )
    if (filled) await expect(page.locator('form')).toContainText('$210')
    for (const format of ['A4', 'Letter'] as const) {
      const buffer = await page.pdf({
        path: info.outputPath(`${format}-${filled ? 'filled' : 'blank'}.pdf`),
        format,
        printBackground: true,
      })
      expect((await PDFDocument.load(buffer)).getPageCount(), format).toBe(1)
    }
    await page.emulateMedia({ media: 'screen' })
    if (filled && garment.gallery.length > 1)
      await expect(page.locator('.ada-gallery__thumbs button').last()).toHaveAttribute(
        'aria-pressed',
        'true',
      )
  }
})
