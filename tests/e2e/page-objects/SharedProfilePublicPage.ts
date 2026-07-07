import { expect, type Locator, type Page } from '@playwright/test'

export class SharedProfilePublicPage {
  constructor(private readonly page: Page) {}

  heading(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'Shared Profile' })
  }

  mainLandmark(): Locator {
    return this.page.locator('main')
  }

  errorState(): Locator {
    return this.page.getByRole('alert')
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading()).toBeVisible()
  }

  async expectNoAppNav(): Promise<void> {
    await expect(this.page.getByRole('navigation', { name: 'Primary navigation' })).toHaveCount(0)
  }
}
