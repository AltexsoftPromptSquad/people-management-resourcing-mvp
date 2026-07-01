import {
  getEmployeeProfilePagePath,
  getSubordinatesPagePath,
  getDashboardPagePath,
} from '../../../src/app/routes'
import type { Page } from '@playwright/test'
import { phase2Baselines, phase2Roles, phase2Routes } from '../fixtures/phase2-data'
import { expect, test } from '../support/test'

test.describe('Phase 2 - routing and role guards', () => {
  const navigateWithinSpa = async (page: Page, route: string) => {
    await page.evaluate((nextRoute) => {
      window.history.pushState({}, '', nextRoute)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }, route)
  }

  test('P2-R01/P2-R02/P2-R03: UM routes and navigation are correct', async ({ page, appShell }) => {
    await page.goto(phase2Routes.dashboard)
    await appShell.expectRoleView(phase2Roles.unitManager)

    await expect(appShell.primaryNavigation().getByRole('link')).toHaveCount(2)
    await expect(appShell.navLink('Dashboard')).toBeVisible()
    await expect(appShell.navLink('Subordinates')).toBeVisible()

    await appShell.navLink('Subordinates').click()
    await expect(page).toHaveURL(new RegExp(`${phase2Routes.subordinates}$`))
    await expect(page.getByRole('heading', { level: 1, name: 'Subordinates' })).toBeVisible()
  })

  test('P2-R04: subordinate row drilldown opens /people/:id', async ({ page }) => {
    await page.goto(phase2Routes.subordinates)

    await page.getByRole('button', { name: phase2Baselines.profileTarget.fullName }).first().click()
    await expect(page).toHaveURL(getEmployeeProfilePagePath(phase2Baselines.profileTarget.id))
    await expect(page.getByRole('heading', { level: 1, name: 'Employee Profile' })).toBeVisible()
  })

  test('P2-R05/P2-R06/P2-R07/P2-R08: non-UM roles are redirected away from UM pages', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase2Routes.dashboard)
    await appShell.switchRole(phase2Roles.deliveryManager.label)
    await appShell.expectRoleView(phase2Roles.deliveryManager)

    await navigateWithinSpa(page, phase2Routes.dashboard)
    await appShell.expectRoleView(phase2Roles.deliveryManager)

    await navigateWithinSpa(page, phase2Routes.subordinates)
    await appShell.expectRoleView(phase2Roles.deliveryManager)

    await navigateWithinSpa(page, getEmployeeProfilePagePath('person-um-001'))
    await appShell.expectRoleView(phase2Roles.deliveryManager)

    await appShell.switchRole(phase2Roles.employee.label)
    await navigateWithinSpa(page, phase2Routes.dashboard)
    await appShell.expectRoleView(phase2Roles.employee)
  })

  test('P2-R09/P2-R10: UM quick-nav target routes and fallback route resolve', async ({ page }) => {
    await page.goto(phase2Routes.customLists)
    await expect(page.getByRole('heading', { level: 1, name: 'Custom Lists' })).toBeVisible()

    await page.goto(phase2Routes.resourcingIncoming)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Incoming Resourcing Requests' }),
    ).toBeVisible()

    await page.goto(phase2Routes.risks)
    await expect(page.getByRole('heading', { level: 1, name: 'Risks' })).toBeVisible()

    await page.goto(phase2Routes.unknown)
    await expect(page).toHaveURL(new RegExp(`${phase2Routes.dashboard}$`))
  })

  test('P2-R11/P2-R12: reload and browser history are stable for UM flow', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase2Routes.dashboard)
    await appShell.navLink('Subordinates').click()
    await expect(page).toHaveURL(new RegExp(`${phase2Routes.subordinates}$`))

    await page.reload()
    await expect(appShell.roleButton(phase2Roles.unitManager.label)).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(page.getByRole('heading', { level: 1, name: 'Subordinates' })).toBeVisible()

    await page.getByRole('button', { name: phase2Baselines.profileTarget.fullName }).first().click()
    await expect(page).toHaveURL(getEmployeeProfilePagePath(phase2Baselines.profileTarget.id))

    await page.goBack()
    await expect(page).toHaveURL(new RegExp(`${phase2Routes.subordinates}`))
    await expect(page.getByRole('heading', { level: 1, name: 'Subordinates' })).toBeVisible()

    await page.goBack()
    await expect(page).toHaveURL(new RegExp(`${phase2Routes.dashboard}$`))
    await expect(page.getByRole('heading', { level: 1, name: 'Manager Dashboard' })).toBeVisible()

    await page.goForward()
    await expect(page).toHaveURL(new RegExp(`${phase2Routes.subordinates}`))
    await expect(page.getByRole('heading', { level: 1, name: 'Subordinates' })).toBeVisible()
  })

  test('P2-R13: route helper paths are present and deterministic', async () => {
    expect(getDashboardPagePath()).toBe('/dashboard')
    expect(getSubordinatesPagePath()).toBe('/subordinates')
    expect(getEmployeeProfilePagePath('person-abc-123')).toBe('/people/person-abc-123')
  })
})
