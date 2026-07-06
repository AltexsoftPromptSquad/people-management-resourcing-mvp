import { RESOURCING_COPY } from '../../../src/features/resourcing/constants/copy'
import { phase4Baselines, phase4Routes } from '../fixtures/phase4-data'
import { EmployeeProfilePage } from '../page-objects/EmployeeProfilePage'
import { ResourcingIncomingPage } from '../page-objects/ResourcingIncomingPage'
import { ResourcingRequestsPage } from '../page-objects/ResourcingRequestsPage'
import { SharedProfilePublicPage } from '../page-objects/SharedProfilePublicPage'
import { expect, test } from '../support/test'

const futureDate = '2027-03-01'

test.describe('Phase 4 - BRD demo scenarios', () => {
  test('P4-D04 (Scenario 4): DM creates and submits request end-to-end', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    const dmPage = new ResourcingRequestsPage(page)
    await dmPage.expectLoaded()

    // Open New Request sheet
    await dmPage.newRequestButton().click()
    const sheet = page.getByRole('dialog')
    await expect(sheet).toBeVisible()
    // First field must receive focus
    await expect(page.getByLabel('Request title *')).toBeFocused()

    // Attempt past start date — should be blocked
    await page.getByLabel('Request title *').fill('Scenario 4 Frontend Engineer')
    await page.getByLabel('Project name *').fill('Scenario 4 Project')
    await page.getByLabel('Required role *').fill('Frontend Engineer')
    await page.getByLabel('Grade level *').fill('M2')
    await page.getByLabel('Required skills (comma-separated) *').fill('React, TypeScript')
    await page.getByLabel('Start date *').fill('2020-01-01')
    await page.getByLabel('Duration *').fill('4 months')
    await page.getByLabel('Assigned Unit Manager *').selectOption({ index: 1 })

    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Start date cannot be in the past.')).toBeVisible()

    // Correct to future date and submit
    await page.getByLabel('Start date *').fill(futureDate)
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Request submitted.')).toBeVisible()
    await expect(dmPage.heading()).toBeVisible()
    // The title appears in both the table cell and the auto-selected panel heading — use first()
    await expect(page.getByText('Scenario 4 Frontend Engineer').first()).toBeVisible()

    // Switch to UM and navigate via SPA to preserve MSW in-memory state
    await appShell.switchRole('Unit Manager')
    await appShell.navLink('Incoming Requests').click()
    const umPage = new ResourcingIncomingPage(page)
    await umPage.expectLoaded()
    await expect(page.getByText('Scenario 4 Frontend Engineer').first()).toBeVisible()
  })

  test('P4-D05 (Scenario 5): UM proposes candidates with warnings, shared profile, and submits', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)

    const umPage = new ResourcingIncomingPage(page)
    await umPage.expectLoaded()
    await umPage.selectRequest(phase4Baselines.submittedRequest.requestCode)

    // Employee browser is visible
    await expect(umPage.unitEmployeesHeading()).toBeVisible()

    // Select an employee with low availability — warnings should appear
    const { firstName, lastName } = phase4Baselines.employeePerson
    await umPage.candidateCheckbox(`${firstName} ${lastName}`).check()

    // Allocation + leave overlap + risk warnings
    await expect(page.getByText(/Allocation would reach.*exceeds 100%/)).toBeVisible()
    await expect(page.getByText(/Has scheduled leave overlapping/)).toBeVisible()
    await expect(page.getByText(/Risk level is (High|Critical)/)).toBeVisible()

    // Fill fit summary
    const fitTextarea = umPage.fitSummaryTextarea(firstName)
    await fitTextarea.fill('Strong candidate with relevant experience.')

    // Try an invalid external URL first
    await umPage.externalUrlInput().fill('bad-url')
    await umPage.addExternalButton().click()
    await expect(
      page.getByText('Enter a valid URL (e.g. https://example.com/profile).'),
    ).toBeVisible()
    await umPage.externalUrlInput().fill('https://example.com/external-candidate-s5')
    await umPage.addExternalButton().click()
    await expect(
      page.getByText('External: https://example.com/external-candidate-s5'),
    ).toBeVisible()

    // Generate shared profile
    await umPage.generateSharedProfileButton().click()
    const profileSheet = page.getByRole('dialog')
    await expect(profileSheet).toBeVisible()

    // basic-info is checked and disabled
    const basicInfoCheckbox = profileSheet.getByRole('checkbox', {
      name: 'Basic info (name, position, grade)',
    })
    await expect(basicInfoCheckbox).toBeChecked()
    await expect(basicInfoCheckbox).toBeDisabled()

    // Sensitive sections are off by default
    await expect(profileSheet.getByRole('checkbox', { name: 'Feedbacks' })).not.toBeChecked()
    await expect(profileSheet.getByRole('checkbox', { name: 'Risks' })).not.toBeChecked()

    await profileSheet.getByRole('button', { name: 'Generate Link' }).click()
    // Use exact:true — 'Shared profile link' is also a substring of the SheetDescription
    await expect(profileSheet.getByText('Shared profile link', { exact: true })).toBeVisible()

    await profileSheet.getByRole('button', { name: 'Copy Link' }).click()
    await expect(page.getByText(RESOURCING_COPY.linkCopied)).toBeVisible()

    await profileSheet.getByRole('button', { name: 'Done' }).click()

    // Submit candidates — confirm dialog with verbatim copy
    await umPage.submitCandidatesButton().click()
    const confirmDialog = page.getByRole('alertdialog')
    await expect(confirmDialog).toContainText(RESOURCING_COPY.confirmSubmitCandidates.title)
    await expect(confirmDialog).toContainText(RESOURCING_COPY.confirmSubmitCandidates.description)
    await expect(
      confirmDialog.getByRole('button', { name: RESOURCING_COPY.confirmSubmitCandidates.cancel }),
    ).toBeVisible()

    await confirmDialog
      .getByRole('button', { name: RESOURCING_COPY.confirmSubmitCandidates.confirm })
      .click()
    await expect(page.getByText(RESOURCING_COPY.candidatesSubmitted)).toBeVisible()
  })

  test('P4-D06 (Scenario 6): DM approves/rejects; UM verifies assignment history', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')

    const dmPage = new ResourcingRequestsPage(page)
    await dmPage.openRequest(phase4Baselines.candidatesProposedRequest.requestCode)

    // Candidate list shows links
    await expect(dmPage.proposedCandidatesHeading()).toBeVisible()
    await expect(dmPage.sharedProfileLink()).toBeVisible()
    await expect(dmPage.externalProfileLink()).toBeVisible()

    // Reject a different candidate first (before approving), so the Reject button is still available.
    // Approval auto-rejects all remaining Proposed candidates, removing their Reject buttons.
    await dmPage.rejectButton(1).click()
    const rejectSheet = page.getByRole('dialog')
    await expect(rejectSheet.getByRole('heading', { name: 'Reject candidate' })).toBeVisible()
    // Submit without reason first → validation error (role="alert" avoids matching SheetDescription)
    await rejectSheet.getByRole('button', { name: 'Reject Candidate' }).click()
    await expect(rejectSheet.getByRole('alert')).toBeVisible()
    // Fill reason and submit
    await page.getByRole('textbox', { name: 'Rejection reason' }).fill('Missing required skills.')
    await rejectSheet.getByRole('button', { name: 'Reject Candidate' }).click()
    await expect(page.getByText(/ rejected\./).first()).toBeVisible()

    // Approve first candidate
    await dmPage.approveButton().click()
    const approvalSheet = page.getByRole('dialog')
    await expect(approvalSheet.getByText('Approve candidate')).toBeVisible()
    await approvalSheet
      .getByRole('textbox', { name: 'Approval note (optional)' })
      .fill('Great fit.')
    await approvalSheet.getByRole('button', { name: 'Approve' }).click()
    await expect(page.getByText(/approved\. Assignment history updated\./)).toBeVisible()

    // Approve button no longer rendered for remaining Proposed candidates
    await expect(dmPage.approveButton()).toHaveCount(0)

    // Navigate within the SPA to preserve MSW in-memory state: page.goto() reloads the app and
    // resets module-level MSW data, so we navigate via React Router (Subordinates → profile click).
    await appShell.switchRole('Unit Manager')
    const employeeFullName = `${phase4Baselines.employeePerson.firstName} ${phase4Baselines.employeePerson.lastName}`
    await appShell.navLink('Subordinates').click()
    await page.getByRole('button', { name: employeeFullName }).click()
    const profile = new EmployeeProfilePage(page)
    await profile.expectLoaded(employeeFullName)

    await profile.openTab('Resourcing History')
    const panel = profile.tabPanel()
    await expect(
      panel.getByText(phase4Baselines.candidatesProposedRequest.title, { exact: false }),
    ).toBeVisible()

    // Open Project History — no assignment history records there
    await profile.openTab('Project History')
    const projectPanel = profile.tabPanel()
    await expect(projectPanel.getByText('Assignment Approved', { exact: true })).toHaveCount(0)

    // Visit shared profile public view
    await page.goto(phase4Routes.sharedProfile)
    const sharedPage = new SharedProfilePublicPage(page)
    await sharedPage.expectLoaded()
    await sharedPage.expectNoAppNav()
  })
})
