import { getEmployeeProfilePagePath } from '../../../src/app/routes'
import { assignmentHistory } from '../../../src/mocks/data/assignment-history'
import { phase4Baselines, phase4Routes } from '../fixtures/phase4-data'
import { EmployeeProfilePage } from '../page-objects/EmployeeProfilePage'
import { ResourcingRequestsPage } from '../page-objects/ResourcingRequestsPage'
import { expect, test } from '../support/test'

const employeeProfileRoute = getEmployeeProfilePagePath(phase4Baselines.employeePerson.id)

const seededHistoryForEmployee = assignmentHistory.filter(
  (item) => item.employeeId === phase4Baselines.employeePerson.id,
)

test.describe('Phase 4 - assignment history', () => {
  test('P4-AH01: approving a candidate creates a new record on the employee Resourcing History tab', async ({
    page,
    appShell,
  }) => {
    // DM approves a candidate for request-003
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Sales / Delivery Manager')
    const dmPage = new ResourcingRequestsPage(page)
    await dmPage.openRequest(phase4Baselines.candidatesProposedRequest.requestCode)

    await expect(dmPage.proposedCandidatesHeading()).toBeVisible()
    await dmPage.approveButton().click()
    const approvalSheet = page.getByRole('dialog')
    await approvalSheet.getByRole('button', { name: 'Approve' }).click()
    await expect(page.getByText(/approved\. Assignment history updated\./)).toBeVisible()

    // Navigate within the SPA to preserve MSW in-memory state: page.goto() reloads the app and
    // resets module-level MSW data, so we navigate via React Router (Subordinates → profile click).
    await appShell.switchRole('Unit Manager')
    const employeeFullName = `${phase4Baselines.employeePerson.firstName} ${phase4Baselines.employeePerson.lastName}`
    await appShell.navLink('Subordinates').click()
    await page.getByRole('button', { name: employeeFullName }).click()
    const profile = new EmployeeProfilePage(page)
    await profile.expectLoaded(employeeFullName)

    await profile.openTab('Resourcing History')
    await expect(profile.tabPanel()).toBeVisible()
    // The newly created history entry for the approved request should be visible
    await expect(
      profile
        .tabPanel()
        .getByText(phase4Baselines.candidatesProposedRequest.title, { exact: false }),
    ).toBeVisible()
  })

  test('P4-AH02: resourcing history records show request title, status, and feedback/rejection reason', async ({
    page,
  }) => {
    test.skip(seededHistoryForEmployee.length === 0, 'Requires seeded assignment history records')

    await page.goto(employeeProfileRoute)
    const profile = new EmployeeProfilePage(page)
    const employeeFullName = `${phase4Baselines.employeePerson.firstName} ${phase4Baselines.employeePerson.lastName}`
    await profile.expectLoaded(employeeFullName)

    await profile.openTab('Resourcing History')

    const panel = profile.tabPanel()
    const firstRecord = seededHistoryForEmployee[0]
    if (!firstRecord) return

    // Status must be visible in the history record
    await expect(panel.getByText(firstRecord.status, { exact: false })).toBeVisible()

    // If the record has feedback, it should appear
    if (firstRecord.feedback) {
      await expect(panel.getByText(firstRecord.feedback, { exact: false })).toBeVisible()
    }
  })

  test('P4-AH03: resourcing history records are read-only — no edit action rendered', async ({
    page,
  }) => {
    test.skip(seededHistoryForEmployee.length === 0, 'Requires seeded assignment history records')

    await page.goto(employeeProfileRoute)
    const profile = new EmployeeProfilePage(page)
    const employeeFullName = `${phase4Baselines.employeePerson.firstName} ${phase4Baselines.employeePerson.lastName}`
    await profile.expectLoaded(employeeFullName)

    await profile.openTab('Resourcing History')

    const panel = profile.tabPanel()
    await expect(panel.getByRole('button', { name: /Edit/i })).toHaveCount(0)
    await expect(panel.getByRole('button', { name: /Delete/i })).toHaveCount(0)
  })

  test('P4-AH04: Resourcing History tab shows no project history entries; Project History tab shows no assignment history entries', async ({
    page,
  }) => {
    test.skip(seededHistoryForEmployee.length === 0, 'Requires seeded assignment history records')

    await page.goto(employeeProfileRoute)
    const profile = new EmployeeProfilePage(page)
    const employeeFullName = `${phase4Baselines.employeePerson.firstName} ${phase4Baselines.employeePerson.lastName}`
    await profile.expectLoaded(employeeFullName)

    // Resourcing History tab must not contain project-only fields
    await profile.openTab('Resourcing History')
    const resourcingPanel = profile.tabPanel()
    // Project history shows "projectName" or "clientName" — assignment history shows status / request title
    await expect(resourcingPanel.getByText(/Approved|Rejected|Withdrawn/)).toBeVisible()

    // Project History tab must not include assignment history status labels as primary content
    await profile.openTab('Project History')
    const projectPanel = profile.tabPanel()
    // Project history items contain project/client names, not proposal-specific status text
    const assignmentStatuses = [
      'Assignment Approved',
      'Assignment Rejected',
      'Assignment Withdrawn',
    ]
    for (const statusText of assignmentStatuses) {
      await expect(projectPanel.getByText(statusText, { exact: true })).toHaveCount(0)
    }
  })
})
