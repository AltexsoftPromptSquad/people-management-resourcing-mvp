import { phase3Baselines, phase3Routes } from '../fixtures/phase3-data'
import { EmployeeProfilePage } from '../page-objects/EmployeeProfilePage'
import { MyProfilePage } from '../page-objects/MyProfilePage'
import { SubordinatesPage } from '../page-objects/SubordinatesPage'
import { selectCustomOption } from '../support/select'
import { expect, test } from '../support/test'

test.describe('Phase 3 - BRD demo scenarios', () => {
  test('P3-E2E01 (Scenario 2): UM filters Subordinates, opens a profile, and reviews all seven tabs with seeded content', async ({
    page,
  }) => {
    const { employeeFullName, employeePerson, expectedTabLabels } = phase3Baselines

    await page.goto(phase3Routes.subordinates)
    const subordinates = new SubordinatesPage(page)
    await subordinates.expectLoaded()

    await subordinates.searchInput().fill(employeePerson.firstName)
    await expect
      .poll(() => new URL(page.url()).searchParams.get('search') ?? '')
      .toBe(employeePerson.firstName)
    await expect(page.getByRole('button', { name: employeeFullName })).toBeVisible()

    await page.getByRole('button', { name: employeeFullName }).first().click()
    const profile = new EmployeeProfilePage(page)
    await profile.expectLoaded(employeeFullName)

    for (const tabLabel of expectedTabLabels) {
      await profile.openTab(tabLabel)
      await expect(profile.tab(tabLabel)).toHaveAttribute('aria-selected', 'true')
      await expect(profile.tabPanel()).not.toBeEmpty()
    }
  })

  test('P3-E2E02 (Scenario 7): Employee edits phone, updates IDP status, and adds a certificate, each confirmed', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole('Employee')
    await appShell.navLink('My Profile').click()

    const myProfile = new MyProfilePage(page)
    await myProfile.expectLoaded()

    await myProfile.editContactButton().click()
    await myProfile
      .section('Contact Information')
      .getByLabel('Personal phone')
      .fill('+380670009999')
    await myProfile.saveContactButton().click()
    await expect(page.getByText('Contact information saved.')).toBeVisible()

    await selectCustomOption(myProfile.idpStatusSelect(), 'Completed')
    await expect(page.getByText('IDP status updated.')).toBeVisible()

    await myProfile.addCertificateButton().click()
    await page.getByLabel('Certificate name *').fill('Scenario 7 Demo Certificate')
    await page.getByLabel('File name *').fill('scenario-7-demo-certificate.pdf')
    await page.getByRole('button', { name: 'Save Certificate' }).click()
    await expect(page.getByText('Certificate added.')).toBeVisible()
    await expect(page.getByText('Scenario 7 Demo Certificate')).toBeVisible()
  })
})
