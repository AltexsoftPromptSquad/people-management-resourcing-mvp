import { expect, type Locator, type Page } from '@playwright/test'

type RoleExpectation = {
  route: string
  heading: string
  personaName: string
  personaId: string
  navLabel: string
}

export class AppShellPage {
  constructor(private readonly page: Page) {}

  roleGroup(): Locator {
    return this.page.getByRole('group', { name: 'Active role' })
  }

  roleButton(label: string): Locator {
    return this.page.getByRole('button', {
      name: new RegExp(`^${this.escape(label)}(?:\\s+selected)?$`),
    })
  }

  primaryNavigation(): Locator {
    return this.page.getByRole('navigation', { name: 'Primary navigation' })
  }

  navLink(label: string): Locator {
    return this.primaryNavigation().getByRole('link', { name: label })
  }

  heading(title: string): Locator {
    return this.page.getByRole('heading', { level: 1, name: title })
  }

  personaText(name: string): Locator {
    return this.page.getByText(name, { exact: true })
  }

  activePersonaSelect(): Locator {
    return this.page.getByLabel('Active persona')
  }

  async switchRole(label: string): Promise<void> {
    await this.roleButton(label).click()
  }

  async expectRoleView(expected: RoleExpectation): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${this.escape(expected.route)}$`))
    await expect(this.heading(expected.heading)).toBeVisible()
    if ((await this.activePersonaSelect().count()) > 0) {
      await expect(this.activePersonaSelect()).toHaveValue(expected.personaId)
    } else {
      await expect(this.personaText(expected.personaName)).toBeVisible()
    }
    await expect(this.navLink(expected.navLabel)).toHaveAttribute('aria-current', 'page')
  }

  async computedStyle(locator: Locator, propertyName: string): Promise<string> {
    return locator.evaluate(
      (element, property) => window.getComputedStyle(element).getPropertyValue(property),
      propertyName,
    )
  }

  private escape(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
}
