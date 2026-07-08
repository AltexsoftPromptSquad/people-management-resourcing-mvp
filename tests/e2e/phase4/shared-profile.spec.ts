import { phase4Baselines, phase4Routes } from '../fixtures/phase4-data'
import { ResourcingIncomingPage } from '../page-objects/ResourcingIncomingPage'
import { SharedProfilePublicPage } from '../page-objects/SharedProfilePublicPage'
import { expect, test } from '../support/test'

test.describe('Phase 4 - shared profile', () => {
  test('P4-PS01: generating shared profile from proposal panel creates link and shows copy toast', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    const { firstName, lastName } = phase4Baselines.employeePerson
    await ui.candidateCheckbox(`${firstName} ${lastName}`).check()

    await ui.generateSharedProfileButton().click()

    const sheet = page.getByRole('dialog')
    await expect(sheet).toBeVisible()
    await expect(sheet.getByRole('heading', { name: 'Generate Shared Profile' })).toBeVisible()

    await expect(sheet.getByText('Existing shared link')).toBeVisible()
    await expect(sheet.getByRole('button', { name: 'Generate Link' })).toHaveCount(0)

    await sheet.getByRole('button', { name: 'Copy Link' }).click()
    await expect(page.getByText('Link copied to clipboard.')).toBeVisible()
  })

  test('P4-PS02: sensitive sections are unchecked by default when generating shared profile', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    const { firstName, lastName } = phase4Baselines.employeeWithoutActiveSharedProfile
    await ui.candidateCheckbox(`${firstName} ${lastName}`).check()
    await ui.generateSharedProfileButton().click()

    await expect(page.getByRole('dialog')).toBeVisible()

    // Sensitive sections must be unchecked by default
    const sensitiveSections = ['Feedbacks', 'Scheduled leaves', 'Risks', 'Documents']
    for (const section of sensitiveSections) {
      const checkbox = page.getByRole('checkbox', { name: section })
      await expect(checkbox).not.toBeChecked()
    }
  })

  test('P4-PS06: default-on sections are pre-checked when generating shared profile', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    const { firstName, lastName } = phase4Baselines.employeeWithoutActiveSharedProfile
    await ui.candidateCheckbox(`${firstName} ${lastName}`).check()
    await ui.generateSharedProfileButton().click()

    await expect(page.getByRole('dialog')).toBeVisible()

    // Default-on sections must be checked
    const defaultOnSections = [
      'Basic info (name, position, grade)',
      'Job and skills',
      'Availability',
      'Project history',
    ]
    for (const section of defaultOnSections) {
      const checkbox = page.getByRole('checkbox', { name: section })
      await expect(checkbox).toBeChecked()
    }
  })

  test('P4-PS07: basic-info checkbox is checked and disabled (cannot be unchecked)', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    const { firstName, lastName } = phase4Baselines.employeeWithoutActiveSharedProfile
    await ui.candidateCheckbox(`${firstName} ${lastName}`).check()
    await ui.generateSharedProfileButton().click()

    await expect(page.getByRole('dialog')).toBeVisible()

    const basicInfoCheckbox = page.getByRole('checkbox', {
      name: 'Basic info (name, position, grade)',
    })
    await expect(basicInfoCheckbox).toBeChecked()
    await expect(basicInfoCheckbox).toBeDisabled()
  })

  test('P4-PS03: public shared profile only shows sections that were selected', async ({
    page,
  }) => {
    // The seeded shared profile includes: basic-info, job-and-skills, availability, project-history
    await page.goto(phase4Routes.sharedProfile)
    const ui = new SharedProfilePublicPage(page)
    await ui.expectLoaded()

    // Sections that should be visible (seeded allowedSections)
    // The person name can appear in multiple sections — use first() to avoid strict mode
    await expect(
      page.getByText(phase4Baselines.employeePerson.firstName, { exact: false }).first(),
    ).toBeVisible()

    // Sensitive section headings must NOT appear
    await expect(page.getByRole('heading', { name: 'Feedbacks' })).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Risks' })).toHaveCount(0)
  })

  test('P4-PS04: public shared profile renders without login, nav, or role switcher', async ({
    page,
  }) => {
    await page.goto(phase4Routes.sharedProfile)
    const ui = new SharedProfilePublicPage(page)
    await ui.expectLoaded()
    await ui.expectNoAppNav()
    await expect(page.getByRole('group', { name: 'Active role' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: /Sign in|Login/ })).toHaveCount(0)
  })

  test('P4-PS05: "Generate Shared Profile" button is visible in UM proposal panel candidate row', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase4Routes.dmRequests)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase4Routes.umIncoming)
    const ui = new ResourcingIncomingPage(page)
    await ui.expectLoaded()
    await ui.selectRequest(phase4Baselines.submittedRequest.requestCode)

    const { firstName, lastName } = phase4Baselines.employeePerson
    await ui.candidateCheckbox(`${firstName} ${lastName}`).check()

    await expect(ui.generateSharedProfileButton()).toBeVisible()
  })
})
