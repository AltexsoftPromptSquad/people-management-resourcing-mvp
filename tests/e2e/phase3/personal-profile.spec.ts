import {
  overrideFetch,
  phase3Baselines,
  phase3Routes,
  type FetchOverrideRule,
} from '../fixtures/phase3-data'
import { MyProfilePage } from '../page-objects/MyProfilePage'
import { selectCustomOption } from '../support/select'
import { expect, test } from '../support/test'

test.describe('Phase 3 - personal profile self-service', () => {
  test('P3-PV01: /my-profile shows only the active employee\u2019s own record', async ({
    page,
    appShell,
  }) => {
    const { employeePerson, employeePersona } = phase3Baselines
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')

    const myProfile = new MyProfilePage(page)
    await myProfile.expectLoaded()
    await expect(page.getByText(employeePersona.displayName, { exact: true })).toBeVisible()

    const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    await expect(
      myProfile
        .section('Profile')
        .getByText(
          new RegExp(
            `${escapeRegExp(employeePerson.firstName)}\\s+${escapeRegExp(employeePerson.lastName)}.+${escapeRegExp(
              employeePerson.position,
            )}.+${escapeRegExp(employeePerson.grade)}`,
          ),
        ),
    ).toBeVisible()
  })

  test('P3-PV02: Contact section toggles to edit mode with Save/Cancel', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')
    const myProfile = new MyProfilePage(page)

    await myProfile.editContactButton().click()
    await expect(myProfile.saveContactButton()).toBeVisible()
    await expect(myProfile.cancelContactButton()).toBeVisible()
    await expect(
      myProfile.section('Contact Information').getByLabel('Personal phone'),
    ).toBeVisible()
    await expect(
      myProfile.section('Contact Information').getByLabel('Personal email'),
    ).toBeVisible()
  })

  test('P3-PV03: invalid email on blur shows a validation error', async ({ page, appShell }) => {
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')
    const myProfile = new MyProfilePage(page)

    await myProfile.editContactButton().click()
    const emailField = myProfile.section('Contact Information').getByLabel('Personal email')
    await emailField.fill('not-a-valid-email')
    await emailField.blur()

    await expect(page.getByText('Enter a valid email address.')).toBeVisible()
  })

  test('P3-PV04: saving contact info returns to view mode with a success toast', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')
    const myProfile = new MyProfilePage(page)

    await myProfile.editContactButton().click()
    await myProfile
      .section('Contact Information')
      .getByLabel('Personal phone')
      .fill('+380670000777')
    await myProfile.saveContactButton().click()

    await expect(page.getByText('Contact information saved.')).toBeVisible()
    await expect(myProfile.section('Contact Information').getByText('+380670000777')).toBeVisible()
    await expect(myProfile.editContactButton()).toBeVisible()
  })

  test('P3-PV05: cancelling contact edit restores original values without a confirm dialog', async ({
    page,
    appShell,
  }) => {
    const { employeePerson } = phase3Baselines
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')
    const myProfile = new MyProfilePage(page)
    const contactSection = myProfile.section('Contact Information')

    let dialogShown = false
    page.on('dialog', () => {
      dialogShown = true
    })

    await myProfile.editContactButton().click()
    await contactSection.getByLabel('Personal phone').fill('+000000000000')
    await myProfile.cancelContactButton().click()

    expect(dialogShown).toBe(false)
    await expect(contactSection.getByText('+000000000000')).toHaveCount(0)
    await expect(
      contactSection.getByText(employeePerson.personalPhone.replace(/\s*x\d+$/i, '').trim()),
    ).toBeVisible()
    await expect(myProfile.editContactButton()).toBeVisible()
  })

  test('P3-PV06: own action items render read-only with an empty-state fallback', async ({
    page,
    appShell,
  }) => {
    const { actionItemsAssignedToEmployee } = phase3Baselines
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')
    const myProfile = new MyProfilePage(page)
    const actionItemsSection = myProfile.section('Action Items')

    if (actionItemsAssignedToEmployee.length > 0) {
      await expect(actionItemsSection.getByRole('listitem')).toHaveCount(
        actionItemsAssignedToEmployee.length,
      )
    } else {
      await expect(actionItemsSection.getByText('No action items')).toBeVisible()
    }

    await expect(actionItemsSection.getByRole('button')).toHaveCount(0)
  })

  test('P3-PV06: own action items show the personal empty-state copy when there are none', async ({
    page,
    appShell,
  }) => {
    await page.addInitScript(overrideFetch, [
      { urlIncludes: '/api/action-items', method: 'GET', respondWith: { status: 200, body: [] } },
    ] satisfies FetchOverrideRule[])
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')
    const myProfile = new MyProfilePage(page)
    const actionItemsSection = myProfile.section('Action Items')

    await expect(actionItemsSection.getByText('No action items')).toBeVisible()
    await expect(
      actionItemsSection.getByText(
        'Action items assigned to you by your manager will appear here.',
      ),
    ).toBeVisible()
  })

  test('P3-PV07: updating IDP status shows a success toast', async ({ page, appShell }) => {
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')
    const myProfile = new MyProfilePage(page)

    await expect(myProfile.idpStatusSelect()).toBeVisible()
    await expect(myProfile.idpStatusSelect()).toContainText(
      phase3Baselines.idpRecordForEmployee.status,
    )
    await selectCustomOption(myProfile.idpStatusSelect(), 'Completed')

    await expect(page.getByText('IDP status updated.')).toBeVisible()
    await expect(myProfile.idpStatusSelect()).toContainText('Completed')
    await expect(
      myProfile.section('IDP Status').getByText('Completed', { exact: true }).last(),
    ).toBeVisible()
  })

  test('P3-PV08: adding a certificate prepends a row with a success toast', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')
    const myProfile = new MyProfilePage(page)
    const documentsSection = myProfile.section('Documents')

    // Wait for the documents query to resolve and render before reading the baseline count,
    // otherwise a still-pending query can race and report 0 items.
    await expect(documentsSection.getByRole('listitem').first()).toBeVisible()
    const beforeCount = await documentsSection.getByRole('listitem').count()

    await myProfile.addCertificateButton().click()
    await expect(page.getByRole('heading', { level: 2, name: 'Add Certificate' })).toBeVisible()
    await page.getByLabel('Certificate name *').fill('Phase 3 QA Certificate')
    await page.getByLabel('File name *').fill('phase-3-qa-certificate.pdf')
    await page.getByRole('button', { name: 'Save Certificate' }).click()

    await expect(page.getByText('Certificate added.')).toBeVisible()
    await expect(myProfile.certificateSheet()).toHaveCount(0)
    const items = documentsSection.getByRole('listitem')
    await expect(items).toHaveCount(beforeCount + 1)
    await expect(items.first()).toContainText('Phase 3 QA Certificate')
  })

  test('P3-PV08: certificate name and file name are required', async ({ page, appShell }) => {
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')
    const myProfile = new MyProfilePage(page)

    await myProfile.addCertificateButton().click()
    await page.getByRole('button', { name: 'Save Certificate' }).click()

    await expect(page.getByText('Certificate name is required.')).toBeVisible()
    await expect(page.getByText('File name is required.')).toBeVisible()
  })

  test('P3-PV09: certificate save failure keeps the sheet open with an error toast', async ({
    page,
    appShell,
  }) => {
    await page.addInitScript(overrideFetch, [
      {
        urlIncludes: '/documents',
        method: 'POST',
        respondWith: { status: 500, body: { message: 'Injected certificate save failure.' } },
      },
    ] satisfies FetchOverrideRule[])
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')
    const myProfile = new MyProfilePage(page)

    await myProfile.addCertificateButton().click()
    await page.getByLabel('Certificate name *').fill('Should Not Save Certificate')
    await page.getByLabel('File name *').fill('should-not-save.pdf')
    await page.getByRole('button', { name: 'Save Certificate' }).click()

    await expect(page.getByText('Could not add certificate. Try again.')).toBeVisible()
    await expect(myProfile.certificateSheet()).toBeVisible()
  })

  test('P3-PV10: manager notes, risks, and assignment history never appear on the personal profile', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')

    await expect(page.getByText('Management Notes')).toHaveCount(0)
    await expect(page.getByText('Risk History')).toHaveCount(0)
    await expect(page.getByText('Resourcing History')).toHaveCount(0)
    await expect(page.getByText('Scheduled Leaves')).toHaveCount(0)
    await expect(page.getByText('Feedbacks')).toHaveCount(0)
  })

  test('P3-PV11: every employee save action surfaces a visible success confirmation', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')
    const myProfile = new MyProfilePage(page)

    await myProfile.editContactButton().click()
    await myProfile
      .section('Contact Information')
      .getByLabel('Personal phone')
      .fill('+380670000888')
    await myProfile.saveContactButton().click()
    await expect(page.getByText('Contact information saved.')).toBeVisible()

    await selectCustomOption(myProfile.idpStatusSelect(), 'In Progress')
    await expect(page.getByText('IDP status updated.')).toBeVisible()

    await myProfile.addCertificateButton().click()
    await page.getByLabel('Certificate name *').fill('PV11 Coverage Certificate')
    await page.getByLabel('File name *').fill('pv11-coverage-certificate.pdf')
    await page.getByRole('button', { name: 'Save Certificate' }).click()
    await expect(page.getByText('Certificate added.')).toBeVisible()
  })
})
