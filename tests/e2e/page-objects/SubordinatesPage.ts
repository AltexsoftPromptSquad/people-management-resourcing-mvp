import { expect, type Locator, type Page } from '@playwright/test'

export class SubordinatesPage {
  constructor(private readonly page: Page) {}

  heading(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'Subordinates' })
  }

  filtersRegion(): Locator {
    return this.page.getByRole('region', { name: 'Subordinates filters' })
  }

  searchInput(): Locator {
    return this.page.getByLabel('Search')
  }

  positionSelect(): Locator {
    return this.filtersRegion().getByRole('combobox', { name: 'Position' })
  }

  gradeSelect(): Locator {
    return this.filtersRegion().getByRole('combobox', { name: 'Grade' })
  }

  statusSelect(): Locator {
    return this.filtersRegion().getByRole('combobox', { name: 'Status' })
  }

  riskSelect(): Locator {
    return this.filtersRegion().getByRole('combobox', { name: 'Risk' })
  }

  table(): Locator {
    return this.page.locator('table')
  }

  rows(): Locator {
    return this.table().locator('tbody tr')
  }

  headerSortButton(name: string): Locator {
    return this.table().getByRole('button', { name: new RegExp(`^${name}(?:\\s+[↑↓])?$`) })
  }

  updatingOverlay(): Locator {
    return this.page.locator('[aria-busy="true"]')
  }

  paginationSummary(): Locator {
    return this.page.getByText(/^Showing \d+-\d+ of \d+$/)
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading()).toBeVisible()
    await expect(this.filtersRegion()).toBeVisible()
    await expect(this.table()).toBeVisible()
  }

  async searchForPerson(fullName: string): Promise<void> {
    await this.searchInput().fill(fullName)
    await expect
      .poll(() => new URL(this.page.url()).searchParams.get('search') ?? '')
      .toBe(fullName)
    await expect(this.page.getByRole('button', { name: fullName }).first()).toBeVisible()
  }
}
