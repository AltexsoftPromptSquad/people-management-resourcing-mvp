import { expect, type Locator, type Page } from '@playwright/test'

export class MyProfilePage {
  constructor(private readonly page: Page) {}

  heading(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'My Profile' })
  }

  section(title: string): Locator {
    // `.filter({ has })` matches any ancestor `<section>` that merely contains the heading as a
    // descendant, which also matches the outer page-wrapper `<section>`. Walk up from the heading
    // to its nearest `<section>` ancestor instead, so nested card sections resolve correctly.
    return this.page
      .getByRole('heading', { level: 2, name: title, exact: true })
      .locator('xpath=ancestor::section[1]')
  }

  editContactButton(): Locator {
    return this.section('Contact Information').getByRole('button', { name: 'Edit' })
  }

  saveContactButton(): Locator {
    return this.section('Contact Information').getByRole('button', { name: 'Save' })
  }

  cancelContactButton(): Locator {
    return this.section('Contact Information').getByRole('button', { name: 'Cancel' })
  }

  idpStatusSelect(): Locator {
    return this.section('IDP Status').getByRole('combobox')
  }

  addCertificateButton(): Locator {
    return this.page.getByRole('button', { name: 'Add Certificate' })
  }

  certificateSheet(): Locator {
    return this.page.getByRole('dialog', { name: 'Add Certificate' })
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading()).toBeVisible()
  }
}
