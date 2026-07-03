import { expect, type Locator, type Page } from '@playwright/test'

export class EmployeeProfilePage {
  constructor(private readonly page: Page) {}

  heading(fullName: string): Locator {
    return this.page.getByRole('heading', { level: 1, name: fullName })
  }

  backButton(): Locator {
    return this.page.getByRole('button', { name: 'Back', exact: true })
  }

  header(): Locator {
    return this.page.locator('header')
  }

  tabList(): Locator {
    return this.page.getByRole('tablist')
  }

  tab(label: string): Locator {
    return this.page.getByRole('tab', { name: label })
  }

  tabPanel(): Locator {
    return this.page.getByRole('tabpanel')
  }

  async openTab(label: string): Promise<void> {
    await this.tab(label).click()
  }

  section(title: string): Locator {
    // `.filter({ has })` matches any ancestor `<section>` that merely contains the heading as a
    // descendant, which also matches the outer page-wrapper `<section>`. Walk up from the heading
    // to its nearest `<section>` ancestor instead, so nested card sections resolve correctly.
    return this.page
      .getByRole('heading', { level: 2, name: title, exact: true })
      .locator('xpath=ancestor::section[1]')
  }

  addFeedbackButton(): Locator {
    return this.page.getByRole('button', { name: 'Add Feedback' })
  }

  feedbackSheet(): Locator {
    return this.page.getByRole('dialog', { name: 'Add Feedback' })
  }

  async expectLoaded(fullName: string): Promise<void> {
    await expect(this.heading(fullName)).toBeVisible()
    await expect(this.tabList()).toBeVisible()
  }
}
