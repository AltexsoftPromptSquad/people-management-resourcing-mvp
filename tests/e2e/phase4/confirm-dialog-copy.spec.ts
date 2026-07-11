import { RESOURCING_COPY } from '../../../src/features/resourcing/constants/copy'
import { phase4Baselines, phase4Routes } from '../fixtures/phase4-data'
import { ResourcingIncomingPage } from '../page-objects/ResourcingIncomingPage'
import { ResourcingRequestsPage } from '../page-objects/ResourcingRequestsPage'
import { expect, test } from '../support/test'

test.describe('Phase 4 - confirm dialog copy', () => {
  test('P4-CC01: Cancel Request ConfirmDialog has verbatim copy per SRS-COPY4-030', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    const ui = new ResourcingRequestsPage(page)
    await ui.openRequest(phase4Baselines.submittedRequest.requestCode)
    await ui.cancelRequestButton().click()

    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText(RESOURCING_COPY.confirmCancelRequest.title)
    await expect(dialog).toContainText(RESOURCING_COPY.confirmCancelRequest.description)
    await expect(
      dialog.getByRole('button', { name: RESOURCING_COPY.confirmCancelRequest.cancel }),
    ).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: RESOURCING_COPY.confirmCancelRequest.confirm }),
    ).toBeVisible()

    // Dismiss without confirming
    await dialog.getByRole('button', { name: RESOURCING_COPY.confirmCancelRequest.cancel }).click()
    await expect(dialog).toHaveCount(0)
  })

  test('P4-CC02: Withdraw Candidate ConfirmDialog has verbatim copy per SRS-COPY4-031', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)

    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.candidatesProposedRequest.requestCode)

    await expect(ui.withdrawButton()).toBeVisible()
    await ui.withdrawButton().click()

    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText(RESOURCING_COPY.confirmWithdraw.title)
    await expect(dialog).toContainText(RESOURCING_COPY.confirmWithdraw.description)
    await expect(
      dialog.getByRole('button', { name: RESOURCING_COPY.confirmWithdraw.cancel }),
    ).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: RESOURCING_COPY.confirmWithdraw.confirm }),
    ).toBeVisible()

    // Dismiss without confirming
    await dialog.getByRole('button', { name: RESOURCING_COPY.confirmWithdraw.cancel }).click()
    await expect(dialog).toHaveCount(0)
  })

  test('P4-CC03: Submit Candidates ConfirmDialog has verbatim copy per SRS-COPY4-032', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)

    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    const { firstName, lastName } = phase4Baselines.candidateWithoutActiveSharedProfile
    await ui.candidateCheckbox(`${firstName} ${lastName}`).check()

    await ui.submitCandidatesButton().click()

    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText(RESOURCING_COPY.confirmSubmitCandidates.title)
    await expect(dialog).toContainText(RESOURCING_COPY.confirmSubmitCandidates.description)
    await expect(
      dialog.getByRole('button', { name: RESOURCING_COPY.confirmSubmitCandidates.cancel }),
    ).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: RESOURCING_COPY.confirmSubmitCandidates.confirm }),
    ).toBeVisible()

    // Dismiss without confirming
    await dialog
      .getByRole('button', { name: RESOURCING_COPY.confirmSubmitCandidates.cancel })
      .click()
    await expect(dialog).toHaveCount(0)
  })

  test('P4-CC04: clicking Reject opens a Sheet directly — no ConfirmDialog fires before the Sheet', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    const ui = new ResourcingRequestsPage(page)
    await ui.openRequest(phase4Baselines.candidatesProposedRequest.requestCode)

    await expect(ui.proposedCandidatesHeading()).toBeVisible()

    // Clicking Reject must open a Sheet (not a ConfirmDialog/alertdialog)
    await ui.rejectButton().click()

    // alertdialog is used for ConfirmDialog — must NOT appear
    await expect(page.getByRole('alertdialog')).toHaveCount(0)

    // A regular dialog (Sheet) must appear with the rejection reason field
    const rejectSheet = page.getByRole('dialog')
    await expect(rejectSheet).toBeVisible()
    await expect(rejectSheet.getByRole('heading', { name: 'Reject candidate' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Rejection reason' })).toBeVisible()
  })
})
