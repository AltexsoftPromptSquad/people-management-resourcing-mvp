import { phase3Baselines, phase3Routes } from '../fixtures/phase3-data'
import { EmployeeProfilePage } from '../page-objects/EmployeeProfilePage'
import { expect, test } from '../support/test'

const formatCustomFieldLabel = (fieldKey: string) =>
  fieldKey
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

test.describe('Phase 3 - custom fields and managerial editing', () => {
  test('P3-C01: all custom field values display on the profile', async ({ page }) => {
    await page.goto(phase3Routes.profile)

    const customFields = new EmployeeProfilePage(page).section('Custom Fields')
    for (const [key, value] of Object.entries(phase3Baselines.employeePerson.customFieldValues)) {
      await expect(
        customFields.getByText(formatCustomFieldLabel(key), { exact: true }),
      ).toBeVisible()
      await expect(customFields.getByText(String(value), { exact: true })).toBeVisible()
    }
  })

  test('P3-C02: custom field click-to-edit commits on Enter and reverts on Escape in-session', async ({
    page,
  }) => {
    const [fieldKey] = Object.keys(phase3Baselines.employeePerson.customFieldValues)
    test.skip(!fieldKey, 'Requires at least one seeded custom field')
    const label = formatCustomFieldLabel(fieldKey)

    await page.goto(phase3Routes.profile)
    const customFields = new EmployeeProfilePage(page).section('Custom Fields')
    const fieldRow = customFields.locator('li').filter({ hasText: label })

    // Escape reverts without persisting the draft.
    await fieldRow.getByRole('button', { name: 'Edit' }).click()
    const input = fieldRow.getByRole('textbox')
    await expect(input).toBeFocused()
    await input.fill('discarded-draft-value')
    await input.press('Escape')
    await expect(fieldRow.getByText('discarded-draft-value')).toHaveCount(0)

    // Enter commits the new value with no toast (per SRS-UX3-091).
    await fieldRow.getByRole('button', { name: 'Edit' }).click()
    await fieldRow.getByRole('textbox').fill('phase-3-custom-value')
    await fieldRow.getByRole('textbox').press('Enter')

    await expect(fieldRow.getByText('phase-3-custom-value', { exact: true })).toBeVisible()
    await expect(page.getByText('Changes saved.')).toHaveCount(0)
  })

  test('P3-M01/P3-M02: UM edits English level and sees a save confirmation with the updated value', async ({
    page,
  }) => {
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Job and Skills')

    const englishSection = profile.section('English Level')
    await englishSection.getByRole('button', { name: 'Edit' }).click()
    await englishSection.getByRole('combobox').selectOption('C1')
    await englishSection.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText('Changes saved.')).toBeVisible()
    await expect(englishSection.getByText('C1', { exact: true })).toBeVisible()
    await expect(englishSection.getByRole('button', { name: 'Edit' })).toBeVisible()
  })

  test('P3-M01/P3-M02: UM edits skills and sees a save confirmation with the updated value', async ({
    page,
  }) => {
    const [skill] = phase3Baselines.skillsForEmployee
    test.skip(!skill, 'Requires at least one seeded skill')

    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Job and Skills')

    const skillsSection = profile.section('Skills')
    await skillsSection.getByRole('button', { name: 'Edit' }).click()
    await skillsSection.getByRole('combobox').first().selectOption('Expert')
    await skillsSection.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText('Changes saved.')).toBeVisible()
    await expect(skillsSection.getByText(`${skill.name} - Expert`)).toBeVisible()
  })

  test('P3-M01/P3-M02: UM edits management notes and sees a save confirmation', async ({
    page,
  }) => {
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Risks and Action Items')

    const notesSection = profile.section('Management Notes')
    await notesSection.getByRole('button', { name: 'Edit' }).click()
    await notesSection.getByRole('textbox').fill('Phase 3 e2e coverage management note.')
    await notesSection.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText('Changes saved.')).toBeVisible()
    await expect(notesSection.getByText('Phase 3 e2e coverage management note.')).toBeVisible()
  })

  test('P3-M01/P3-M02: UM edits the IDP reference and sees a save confirmation', async ({
    page,
  }) => {
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Documents and IDP')

    const idpSection = profile.section('IDP Reference')
    await idpSection.getByRole('button', { name: 'Edit' }).click()
    await idpSection.getByRole('textbox').fill('IDP-2026-PHASE3-E2E')
    await idpSection.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText('Changes saved.')).toBeVisible()
    await expect(idpSection.getByText('IDP-2026-PHASE3-E2E')).toBeVisible()
  })

  test('P3-V01: manager notes are visible on the managerial profile', async ({ page }) => {
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Risks and Action Items')

    await expect(profile.section('Management Notes')).toBeVisible()
  })

  test('P3-V02: manager notes never appear on the personal profile', async ({ page, appShell }) => {
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')

    await expect(page.getByText('Management Notes')).toHaveCount(0)
    await expect(page.getByText('No manager notes.')).toHaveCount(0)
  })

  test('P3-V03: feedback entries never appear on the personal profile', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')

    await expect(page.getByText('Feedbacks')).toHaveCount(0)
    for (const feedback of phase3Baselines.feedbacksForEmployee) {
      await expect(page.getByText(feedback.content)).toHaveCount(0)
    }
  })
})
