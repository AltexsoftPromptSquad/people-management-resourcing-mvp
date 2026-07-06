import { expect, type Locator, type Page } from '@playwright/test'

export class ResourcingIncomingPage {
  constructor(private readonly page: Page) {}

  heading(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'Incoming Requests' })
  }

  requestRow(requestCode: string): Locator {
    return this.page.getByRole('row').filter({ hasText: requestCode })
  }

  proposalPanel(): Locator {
    return this.page.locator('.rounded-xl.border').last()
  }

  unitEmployeesHeading(): Locator {
    return this.page.getByText('Unit employees')
  }

  selectedCandidatesHeading(): Locator {
    return this.page.getByText('Selected candidates')
  }

  submitCandidatesButton(): Locator {
    return this.page.getByRole('button', { name: 'Submit Candidates' })
  }

  externalUrlInput(): Locator {
    return this.page.getByRole('textbox', { name: 'External profile URL' })
  }

  addExternalButton(): Locator {
    return this.page.getByRole('button', { name: 'Add' })
  }

  generateSharedProfileButton(): Locator {
    return this.page.getByRole('button', { name: 'Generate Shared Profile' }).first()
  }

  withdrawButton(nth = 0): Locator {
    return this.page.getByRole('button', { name: 'Withdraw' }).nth(nth)
  }

  candidateCheckbox(label: string): Locator {
    return this.page.getByRole('checkbox', { name: new RegExp(label) })
  }

  fitSummaryTextarea(firstName: string): Locator {
    return this.page.getByRole('textbox', { name: new RegExp(`Fit summary for ${firstName}`) })
  }

  emptyState(): Locator {
    return this.page.getByText('No incoming requests')
  }

  errorState(): Locator {
    return this.page.getByRole('alert')
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading()).toBeVisible()
  }

  async selectRequest(requestCode: string): Promise<void> {
    await this.requestRow(requestCode).click()
  }
}
