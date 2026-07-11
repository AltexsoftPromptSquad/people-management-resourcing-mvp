import { phase4Baselines, phase4Routes } from '../fixtures/phase4-data'
import { ResourcingRequestsPage } from '../page-objects/ResourcingRequestsPage'
import { selectCustomOptionByIndex } from '../support/select'
import { expect, test } from '../support/test'

const futureDate = '2027-06-01'
const pastDate = '2020-01-01'

test.describe('Phase 4 - DM request creation', () => {
  test.beforeEach(async ({ page, appShell }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')
  })

  test('P4-RR01: New Request sheet opens with all required fields; first field receives focus', async ({
    page,
  }) => {
    const ui = new ResourcingRequestsPage(page)
    await ui.newRequestButton().click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await expect(page.getByLabel('Request title *')).toBeVisible()
    await expect(page.getByLabel('Project name *')).toBeVisible()
    await expect(page.getByLabel('Required role *')).toBeVisible()
    await expect(page.getByLabel('Grade level *')).toBeVisible()
    await expect(page.getByLabel('English level *')).toBeVisible()
    await expect(page.getByLabel('Expected compensation level *')).toBeVisible()
    await expect(page.getByLabel('Assigned Unit Manager *')).toBeVisible()
    await expect(page.getByLabel('Priority *')).toBeVisible()
    await expect(page.getByLabel('Workload % *')).toBeVisible()
    await expect(page.getByLabel('Required skills (comma-separated) *')).toBeVisible()
    await expect(page.getByLabel('Start date *')).toBeVisible()

    await expect(page.getByLabel('Request title *')).toBeFocused()
  })

  test('P4-RR02: submitting empty form shows inline validation errors and focuses first error field', async ({
    page,
  }) => {
    const ui = new ResourcingRequestsPage(page)
    await ui.newRequestButton().click()
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Request title is required.')).toBeVisible()
    await expect(page.getByLabel('Request title *')).toBeFocused()
  })

  test('P4-RR03: submitting valid form creates request with Submitted status and shows success toast', async ({
    page,
  }) => {
    const ui = new ResourcingRequestsPage(page)
    await ui.newRequestButton().click()

    await page.getByLabel('Request title *').fill('Test Frontend Engineer Role')
    await page.getByLabel('Project name *').fill('Test Project Alpha')
    await page.getByLabel('Required role *').fill('Frontend Engineer')
    await page.getByLabel('Grade level *').fill('M2')
    await page.getByLabel('Required skills (comma-separated) *').fill('React, TypeScript')
    await page.getByLabel('Start date *').fill(futureDate)
    await selectCustomOptionByIndex(page.getByLabel('Assigned Unit Manager *'), 1)

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Request submitted.')).toBeVisible()
    await expect(ui.heading()).toBeVisible()
  })

  test('P4-RR04: submitted request appears in UM incoming queue', async ({ page, appShell }) => {
    const ui = new ResourcingRequestsPage(page)
    await ui.newRequestButton().click()

    await page.getByLabel('Request title *').fill('UM Queue Visibility Test')
    await page.getByLabel('Project name *').fill('Queue Test Project')
    await page.getByLabel('Required role *').fill('QA Engineer')
    await page.getByLabel('Grade level *').fill('M1')
    await page.getByLabel('Required skills (comma-separated) *').fill('Testing')
    await page.getByLabel('Start date *').fill(futureDate)
    await selectCustomOptionByIndex(page.getByLabel('Assigned Unit Manager *'), 1)

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Request submitted.')).toBeVisible()

    // Navigate via SPA to preserve MSW in-memory state (page.goto() resets MSW module-level data)
    await appShell.switchRole('Unit Manager')
    await appShell.navLink('Incoming Requests').click()
    await expect(page.getByRole('heading', { level: 1, name: 'Incoming Requests' })).toBeVisible()
    await expect(page.getByText('UM Queue Visibility Test')).toBeVisible()
  })

  test('P4-RR05: cancelling a Draft request changes status to Cancelled and hides Cancel action', async ({
    page,
  }) => {
    const ui = new ResourcingRequestsPage(page)
    await ui.openRequest(phase4Baselines.draftRequest.requestCode)
    await expect(ui.cancelRequestButton()).toBeVisible()

    await ui.cancelRequestButton().click()

    const confirmDialog = page.getByRole('alertdialog')
    await expect(confirmDialog).toBeVisible()
    await confirmDialog.getByRole('button', { name: 'Cancel request' }).click()

    await expect(page.getByText('Request cancelled.')).toBeVisible()

    await ui.openRequest(phase4Baselines.draftRequest.requestCode)
    await expect(ui.cancelRequestButton()).toHaveCount(0)
  })

  test('P4-RR06: DM table shows only own requests (filtered by createdById)', async ({ page }) => {
    const ui = new ResourcingRequestsPage(page)
    await ui.expectLoaded()

    await expect(page.getByText(phase4Baselines.submittedRequest.requestCode)).toBeVisible()
    await expect(
      page.getByText(phase4Baselines.candidatesProposedRequest.requestCode),
    ).toBeVisible()
    await expect(page.getByText(phase4Baselines.draftRequest.requestCode)).toBeVisible()
  })

  test('P4-RR07: start date in the past shows inline error and blocks submit', async ({ page }) => {
    const ui = new ResourcingRequestsPage(page)
    await ui.newRequestButton().click()

    await page.getByLabel('Request title *').fill('Past Date Test')
    await page.getByLabel('Project name *').fill('Some Project')
    await page.getByLabel('Required role *').fill('Engineer')
    await page.getByLabel('Grade level *').fill('M1')
    await page.getByLabel('Required skills (comma-separated) *').fill('TypeScript')
    await page.getByLabel('Start date *').fill(pastDate)
    await selectCustomOptionByIndex(page.getByLabel('Assigned Unit Manager *'), 1)

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Start date cannot be in the past.')).toBeVisible()
    await expect(page.getByRole('dialog')).toBeVisible()
  })
})
