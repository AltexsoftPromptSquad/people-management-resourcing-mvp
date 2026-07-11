import { expect, type Locator, type Page } from '@playwright/test'

export class DashboardPage {
  constructor(private readonly page: Page) {}

  heading(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'Manager Dashboard' })
  }

  summaryRegion(): Locator {
    return this.page.getByRole('region', { name: 'Dashboard summary' })
  }

  summaryCard(label: string): Locator {
    return this.summaryRegion().locator('article').filter({ hasText: label })
  }

  summaryValue(label: string): Locator {
    return this.summaryCard(label).locator('p').last()
  }

  actionItemsRegion(): Locator {
    return this.page.getByRole('region', { name: 'Manager action items' })
  }

  actionItemsListItems(): Locator {
    return this.actionItemsRegion().locator('li')
  }

  actionItemStatusPills(): Locator {
    return this.actionItemsRegion().locator('li [data-slot="badge"]')
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading()).toBeVisible()
    await expect(this.summaryRegion()).toBeVisible()
    await expect(this.actionItemsRegion()).toBeVisible()
  }
}
