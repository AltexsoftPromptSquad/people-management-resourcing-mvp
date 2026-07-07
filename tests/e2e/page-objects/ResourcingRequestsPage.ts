import { expect, type Locator, type Page } from '@playwright/test'

export class ResourcingRequestsPage {
  constructor(private readonly page: Page) {}

  heading(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'My Requests' })
  }

  newRequestButton(): Locator {
    return this.page.getByRole('button', { name: 'New Request' })
  }

  requestRow(requestCode: string): Locator {
    return this.page.getByRole('row').filter({ hasText: requestCode })
  }

  requestTitle(title: string): Locator {
    return this.page.getByText(title)
  }

  cancelButtonForRow(requestCode: string): Locator {
    return this.requestRow(requestCode).getByRole('button', { name: 'Cancel' })
  }

  statusPill(status: string): Locator {
    return this.page.getByText(status, { exact: true }).first()
  }

  detailPanel(): Locator {
    return this.page.locator('.rounded-xl.border').last()
  }

  cancelRequestButton(): Locator {
    return this.page.getByRole('button', { name: 'Cancel Request' })
  }

  proposedCandidatesHeading(): Locator {
    return this.page.getByText('Proposed candidates')
  }

  approveButton(nth = 0): Locator {
    return this.page.getByRole('button', { name: 'Approve' }).nth(nth)
  }

  rejectButton(nth = 0): Locator {
    return this.page.getByRole('button', { name: 'Reject' }).nth(nth)
  }

  sharedProfileLink(): Locator {
    return this.page.getByRole('link', { name: 'View shared profile' })
  }

  externalProfileLink(): Locator {
    return this.page.getByRole('link', { name: 'External profile' })
  }

  emptyState(): Locator {
    return this.page.getByText('No requests yet')
  }

  errorState(): Locator {
    return this.page.getByRole('alert')
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading()).toBeVisible()
  }

  async openRequest(requestCode: string): Promise<void> {
    await this.requestRow(requestCode).click()
  }
}
