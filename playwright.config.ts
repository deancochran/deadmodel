import { defineConfig, devices } from '@playwright/test'

const port = process.env.PLAYWRIGHT_PORT || '4174'
const baseURL = `http://127.0.0.1:${port}${process.env.PAGES_BASE_PATH || ''}/`

export default defineConfig({
  testDir: './tests',
  forbidOnly: Boolean(process.env.CI),
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'node scripts/preview.mjs',
    env: { PORT: port },
    url: baseURL,
    reuseExistingServer: false,
  },
})
