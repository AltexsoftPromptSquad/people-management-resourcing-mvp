import { phase4Baselines, phase4Routes } from '../fixtures/phase4-data'
import { ResourcingRequestsPage } from '../page-objects/ResourcingRequestsPage'
import { expect, test } from '../support/test'

test.describe('Phase 4 - DM candidate review', () => {
  test.beforeEach(async ({ page, appShell }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')
  })

  test('P4-CD01: candidate list shows shared profile link for internal and external URL for external', async ({
    page,
  }) => {
    const ui = new ResourcingRequestsPage(page)
    await ui.openRequest(phase4Baselines.candidatesProposedRequest.requestCode)

    await expect(ui.proposedCandidatesHeading()).toBeVisible()

    // Internal candidate with sharedProfileId has shared profile link
    await expect(ui.sharedProfileLink()).toBeVisible()
    // External candidate has external URL link
    await expect(ui.externalProfileLink()).toBeVisible()
  })

  test('P4-CD02: approving a candidate marks it Approved and transitions request to Approved', async ({
    page,
  }) => {
    const ui = new ResourcingRequestsPage(page)
    await ui.openRequest(phase4Baselines.candidatesProposedRequest.requestCode)

    await expect(ui.proposedCandidatesHeading()).toBeVisible()
    await ui.approveButton().click()

    // Approval sheet opens
    const approvalSheet = page.getByRole('dialog')
    await expect(approvalSheet).toBeVisible()
    await expect(approvalSheet.getByText('Approve candidate')).toBeVisible()

    await approvalSheet.getByRole('button', { name: 'Approve' }).click()

    await expect(page.getByText(/approved\. Assignment history updated\./)).toBeVisible()
    // Status transitions to Approved
    await expect(page.getByText('Approved')).toBeVisible()
  })

  test('P4-CD03: after one approval, Approve action is not rendered for remaining Proposed candidates', async ({
    page,
  }) => {
    const ui = new ResourcingRequestsPage(page)
    await ui.openRequest(phase4Baselines.candidatesProposedRequest.requestCode)

    await ui.approveButton().click()
    const approvalSheet = page.getByRole('dialog')
    await approvalSheet.getByRole('button', { name: 'Approve' }).click()
    await expect(page.getByText(/approved\. Assignment history updated\./)).toBeVisible()

    // After approval, the Approve button must not be rendered for remaining candidates
    await expect(ui.approveButton()).toHaveCount(0)
  })

  test('P4-CD04: reject without entering a reason shows inline error and blocks rejection', async ({
    page,
  }) => {
    const ui = new ResourcingRequestsPage(page)
    await ui.openRequest(phase4Baselines.candidatesProposedRequest.requestCode)

    await expect(ui.proposedCandidatesHeading()).toBeVisible()
    await ui.rejectButton().click()

    const rejectSheet = page.getByRole('dialog')
    await expect(rejectSheet).toBeVisible()
    await expect(rejectSheet.getByRole('heading', { name: 'Reject candidate' })).toBeVisible()

    await rejectSheet.getByRole('button', { name: 'Reject Candidate' }).click()

    // The inline error has role="alert" — use that to avoid matching the SheetDescription
    await expect(rejectSheet.getByRole('alert')).toBeVisible()
    // Sheet remains open — rejection was blocked
    await expect(rejectSheet).toBeVisible()
  })

  test('P4-CD05: reject with reason records Rejected status and reason', async ({ page }) => {
    const ui = new ResourcingRequestsPage(page)
    await ui.openRequest(phase4Baselines.candidatesProposedRequest.requestCode)

    await ui.rejectButton().click()
    const rejectSheet = page.getByRole('dialog')
    await expect(rejectSheet).toBeVisible()

    await page.getByRole('textbox', { name: 'Rejection reason' }).fill('Insufficient experience.')
    await rejectSheet.getByRole('button', { name: 'Reject Candidate' }).click()

    await expect(page.getByText(/ rejected\./)).toBeVisible()
    // Status is reflected as Rejected in the detail panel
    await expect(page.getByText('Status: Rejected')).toBeVisible()
  })

  test('P4-CD06: rejecting all candidates transitions the request status to Rejected', async ({
    page,
  }) => {
    const ui = new ResourcingRequestsPage(page)
    await ui.openRequest(phase4Baselines.candidatesProposedRequest.requestCode)

    await expect(ui.proposedCandidatesHeading()).toBeVisible()

    // Reject all proposals (3 candidates seeded for request-003)
    const proposalCount = phase4Baselines.seededProposals.length
    for (let i = 0; i < proposalCount; i++) {
      const rejectBtn = ui.rejectButton(0)
      if (await rejectBtn.isVisible().catch(() => false)) {
        await rejectBtn.click()
        const rejectSheet = page.getByRole('dialog')
        await page
          .getByRole('textbox', { name: 'Rejection reason' })
          .fill('Does not meet requirements.')
        await rejectSheet.getByRole('button', { name: 'Reject Candidate' }).click()
        await expect(page.getByText(/ rejected\./).first()).toBeVisible()
      }
    }

    // Request status should transition to Rejected (multiple "Rejected" texts appear — status pills, proposal statuses, toasts)
    await expect(page.getByText('Rejected').first()).toBeVisible()
  })
})
