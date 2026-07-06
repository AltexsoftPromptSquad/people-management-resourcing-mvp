import { config as loadEnv } from 'dotenv'
import { defineConfig } from '@playwright/test'

loadEnv({ path: '.env', quiet: true })

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { outputFolder: 'tests/e2e/.report', open: 'never' }]],
  use: {
    baseURL,
    viewport: { width: 1280, height: 800 },
    trace: 'on-first-retry',
  },
  outputDir: 'test-results',
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
