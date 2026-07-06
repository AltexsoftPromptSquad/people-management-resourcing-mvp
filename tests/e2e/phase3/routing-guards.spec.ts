import type { Page } from '@playwright/test'
import { getEmployeeProfilePagePath } from '../../../src/app/routes'
import { phase3Baselines, phase3Roles, phase3Routes } from '../fixtures/phase3-data'
import { EmployeeProfilePage } from '../page-objects/EmployeeProfilePage'
import { SubordinatesPage } from '../page-objects/SubordinatesPage'
import { expect, test } from '../support/test'

test.describe('Phase 3 - routing and role guards', () => {
  const navigateWithinSpa = async (page: Page, route: string) => {
    await page.evaluate((nextRoute) => {
      window.history.pushState({}, '', nextRoute)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }, route)
  }

  test('P3-R01: UM drilldown from Subordinates opens the full managerial profile', async ({
    page,
  }) => {
    await page.goto(phase3Routes.subordinates)
    const subordinates = new SubordinatesPage(page)
    await subordinates.expectLoaded()

    await page.getByRole('button', { name: phase3Baselines.employeeFullName }).first().click()

    await expect(page).toHaveURL(getEmployeeProfilePagePath(phase3Baselines.employeePerson.id))
    const profile = new EmployeeProfilePage(page)
    await profile.expectLoaded(phase3Baselines.employeeFullName)
    await expect(profile.section('Basic Information')).toBeVisible()
  })

  test('P3-R02: unknown person id renders "Profile not found." without crashing', async ({
    page,
  }) => {
    // Navigate in-app (rather than a fresh page.goto) so the "Back to Subordinates" button, which
    // relies on `navigate(-1)`, has a prior history entry to return to.
    await page.goto(phase3Routes.subordinates)
    await navigateWithinSpa(page, phase3Routes.profileForUnknownId)

    const errorState = page.getByRole('alert')
    await expect(errorState).toBeVisible()
    await expect(errorState).toContainText('Profile not found.')

    const backButton = page.getByRole('button', { name: 'Back to Subordinates' })
    await expect(backButton).toBeVisible()
    await backButton.click()
    await expect(page).toHaveURL(new RegExp(`${phase3Routes.subordinates}$`))
  })

  test('P3-R03: Delivery Manager direct URL to /people/:id is redirected to their landing', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole(phase3Roles.deliveryManager.label)
    await appShell.expectRoleView(phase3Roles.deliveryManager)

    await navigateWithinSpa(page, phase3Routes.profile)
    await appShell.expectRoleView(phase3Roles.deliveryManager)
  })

  test('P3-R04: Employee direct URL to /people/:id is redirected to /my-profile', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole(phase3Roles.employee.label)
    await appShell.expectRoleView(phase3Roles.employee)

    await navigateWithinSpa(page, phase3Routes.profile)
    await appShell.expectRoleView(phase3Roles.employee)
  })

  test('P3-R05: Employee /my-profile shows only their own record', async ({ page, appShell }) => {
    await page.goto(phase3Routes.dashboard)
    await appShell.switchRole(phase3Roles.employee.label)

    await expect(page.getByRole('heading', { level: 1, name: 'My Profile' })).toBeVisible()
    await expect(
      page.getByText(
        `${phase3Baselines.employeePerson.firstName} ${phase3Baselines.employeePerson.lastName}`,
        { exact: true },
      ),
    ).toBeVisible()
  })

  test('P3-R06: Unit Manager and Delivery Manager direct URL to /my-profile are redirected', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase3Routes.dashboard)
    await navigateWithinSpa(page, phase3Routes.myProfile)
    await appShell.expectRoleView(phase3Roles.unitManager)

    await appShell.switchRole(phase3Roles.deliveryManager.label)
    await navigateWithinSpa(page, phase3Routes.myProfile)
    await appShell.expectRoleView(phase3Roles.deliveryManager)
  })

  test('P3-R07: Back button on profile returns to the prior page', async ({ page }) => {
    await page.goto(phase3Routes.subordinates)
    await page.getByRole('button', { name: phase3Baselines.employeeFullName }).first().click()
    await expect(page).toHaveURL(getEmployeeProfilePagePath(phase3Baselines.employeePerson.id))

    await page.getByRole('button', { name: 'Back', exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`${phase3Routes.subordinates}$`))
  })

  test('P3-R08: reload on /people/:id resets role to Unit Manager and profile still resolves', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase3Routes.profile)
    await expect(appShell.roleButton(phase3Roles.unitManager.label)).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    const profile = new EmployeeProfilePage(page)
    await profile.expectLoaded(phase3Baselines.employeeFullName)

    await page.reload()
    await expect(appShell.roleButton(phase3Roles.unitManager.label)).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await profile.expectLoaded(phase3Baselines.employeeFullName)
  })

  test('P3-R09: profile renders for a person outside the active Unit Manager unit', async ({
    page,
  }) => {
    await page.goto(getEmployeeProfilePagePath(phase3Baselines.deliveryManagerPersona.personId))

    const profile = new EmployeeProfilePage(page)
    await profile.expectLoaded(phase3Baselines.deliveryManagerPersona.displayName)
  })
})
