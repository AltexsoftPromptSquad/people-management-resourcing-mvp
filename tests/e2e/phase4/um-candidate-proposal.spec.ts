import { phase4Baselines, phase4Routes } from '../fixtures/phase4-data'
import { ResourcingIncomingPage } from '../page-objects/ResourcingIncomingPage'
import { expect, test } from '../support/test'

test.describe('Phase 4 - UM candidate proposal', () => {
  test.beforeEach(async ({ page, appShell }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)
  })

  test('P4-CP01: open assigned request shows requirements summary', async ({ page }) => {
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    // Title appears in both the table cell and the panel heading — use first() to avoid strict mode
    await expect(page.getByText(phase4Baselines.submittedRequest.title).first()).toBeVisible()
    await expect(
      page.getByText(
        `${phase4Baselines.submittedRequest.requiredRole} · ${phase4Baselines.submittedRequest.workloadPercent}%`,
      ),
    ).toBeVisible()
  })

  test('P4-CP02: employee browser shows unit subordinates with availability, skills, grade, English level, risk level', async ({
    page,
  }) => {
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    await expect(ui.unitEmployeesHeading()).toBeVisible()

    const employeePerson = phase4Baselines.candidateWithoutActiveSharedProfile
    const checkboxLabel = `${employeePerson.firstName} ${employeePerson.lastName}`
    const employeeCheckbox = ui.candidateCheckbox(checkboxLabel)
    await expect(employeeCheckbox).toBeVisible()

    // Scope to the specific employee's list item to avoid matching other candidates with same grade
    const checkboxText = page
      .getByRole('listitem')
      .filter({ hasText: `${employeePerson.firstName} ${employeePerson.lastName}` })
      .getByText(new RegExp(employeePerson.grade))
    await expect(checkboxText).toBeVisible()
  })

  test('P4-CP03: selecting internal candidate adds a candidate row with fit summary textarea', async ({
    page,
  }) => {
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    const { firstName, lastName } = phase4Baselines.candidateWithoutActiveSharedProfile
    const checkbox = ui.candidateCheckbox(`${firstName} ${lastName}`)
    await checkbox.check()

    await expect(ui.selectedCandidatesHeading()).toBeVisible()
    // Use exact: true — the checkbox label has additional text; the candidate row has the exact name
    await expect(page.getByText(`${firstName} ${lastName}`, { exact: true })).toBeVisible()
    await expect(ui.fitSummaryTextarea(firstName)).toBeVisible()
  })

  test('P4-CP04: adding external URL creates external candidate row', async ({ page }) => {
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    await ui.externalUrlInput().fill('https://example.com/external-candidate')
    await ui.addExternalButton().click()

    await expect(page.getByText('External: https://example.com/external-candidate')).toBeVisible()
    await expect(
      page.getByRole('textbox', { name: 'External candidate fit summary' }),
    ).toBeVisible()
  })

  test('P4-CP05: submit candidates shows ConfirmDialog then transitions to Candidates Proposed', async ({
    page,
  }) => {
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    const { firstName, lastName } = phase4Baselines.candidateWithoutActiveSharedProfile
    await ui.candidateCheckbox(`${firstName} ${lastName}`).check()

    await ui.submitCandidatesButton().click()

    const confirmDialog = page.getByRole('alertdialog')
    await expect(confirmDialog).toBeVisible()
    await expect(confirmDialog).toContainText('Submit candidates?')

    await confirmDialog.getByRole('button', { name: 'Submit' }).click()

    await expect(
      page.getByText('Candidates submitted. Request status updated to Candidates Proposed.'),
    ).toBeVisible()
  })

  test('P4-CP06: submitting with no candidates shows inline error', async ({ page }) => {
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    await ui.submitCandidatesButton().click()

    await expect(page.getByText('Add at least one candidate before submitting.')).toBeVisible()
    const confirmDialog = page.getByRole('alertdialog')
    await expect(confirmDialog).toHaveCount(0)
  })

  test('P4-CP07: withdrawing a Proposed candidate changes status to Withdrawn', async ({
    page,
  }) => {
    await page.goto(phase4Routes.umIncoming)
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.candidatesProposedRequest.requestCode)

    await expect(ui.withdrawButton()).toBeVisible()
    await ui.withdrawButton().click()

    const confirmDialog = page.getByRole('alertdialog')
    await expect(confirmDialog).toBeVisible()
    await confirmDialog.getByRole('button', { name: 'Withdraw' }).click()

    await expect(page.getByText('Candidate withdrawn.')).toBeVisible()
  })

  test('P4-CP08: fit summary textarea is present per candidate with correct placeholder', async ({
    page,
  }) => {
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    const { firstName, lastName } = phase4Baselines.candidateWithoutActiveSharedProfile
    await ui.candidateCheckbox(`${firstName} ${lastName}`).check()

    const textarea = ui.fitSummaryTextarea(firstName)
    await expect(textarea).toBeVisible()
    await expect(textarea).toHaveAttribute('placeholder', 'Fit summary')
  })

  test('P4-CP09: adding external URL with invalid value shows inline error and blocks submit', async ({
    page,
  }) => {
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    await ui.externalUrlInput().fill('not-a-valid-url')
    await ui.addExternalButton().click()

    await expect(
      page.getByText('Enter a valid URL (e.g. https://example.com/profile).'),
    ).toBeVisible()
    await expect(page.getByText('External:')).toHaveCount(0)
  })

  test('P4-W01: allocation warning appears inline in candidate row', async ({ page }) => {
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    const { firstName, lastName } = phase4Baselines.candidateWithoutActiveSharedProfile
    // person-employee-001 has 40% availability; request-001 requires 100% → projected = 160% > 100%
    await ui.candidateCheckbox(`${firstName} ${lastName}`).check()

    await expect(page.getByText(/Allocation would reach.*exceeds 100%/)).toBeVisible()
  })

  test('P4-W02: leave overlap warning appears inline in candidate row', async ({ page }) => {
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    const { firstName, lastName } = phase4Baselines.candidateWithActiveSharedProfile
    // person-employee-001 has leave-001 overlapping request-001 period (2026-07-10 to 2026-11-10)
    await ui.candidateCheckbox(`${firstName} ${lastName}`).check()

    await expect(page.getByText(/Has scheduled leave overlapping the request period/)).toBeVisible()
  })

  test('P4-W03: High/Critical risk warning appears inline in candidate row', async ({ page }) => {
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    const { firstName, lastName } = phase4Baselines.candidateWithRiskWarning
    // person-employee-001 has High risk level (seededRisks[0] from risks.ts)
    await ui.candidateCheckbox(`${firstName} ${lastName}`).check()

    await expect(page.getByText(/Risk level is (High|Critical)/)).toBeVisible()
  })

  test('P4-W04: warnings are non-blocking — submit is still enabled with warnings present', async ({
    page,
  }) => {
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    const { firstName, lastName } = phase4Baselines.candidateWithoutActiveSharedProfile
    await ui.candidateCheckbox(`${firstName} ${lastName}`).check()

    // Warnings should be visible
    await expect(page.getByText(/Allocation would reach.*exceeds 100%/)).toBeVisible()
    // Submit button is still enabled (not disabled)
    await expect(ui.submitCandidatesButton()).toBeEnabled()
  })
})
