import { phase1Roles, phase1Routes } from '../fixtures/mock-baselines'
import { expect, test } from '../support/test'

test.describe('Phase 1 Role Switcher (checks #1-6)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(phase1Routes.dashboard)
  })

  test('check #1: role switcher is visible with all role options', async ({ appShell }) => {
    await expect(appShell.roleGroup()).toBeVisible()
    await expect(appShell.roleButton(phase1Roles.unitManager.label)).toBeVisible()
    await expect(appShell.roleButton(phase1Roles.deliveryManager.label)).toBeVisible()
    await expect(appShell.roleButton(phase1Roles.employee.label)).toBeVisible()
  })

  test('check #2: default Unit Manager persona loads', async ({ appShell }) => {
    await appShell.expectRoleView(phase1Roles.unitManager)
    await expect(appShell.roleButton(phase1Roles.unitManager.label)).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  test('check #3: switch to Delivery Manager', async ({ appShell }) => {
    await appShell.switchRole(phase1Roles.deliveryManager.label)
    await appShell.expectRoleView(phase1Roles.deliveryManager)
  })

  test('check #4: switch to Employee', async ({ appShell }) => {
    await appShell.switchRole(phase1Roles.employee.label)
    await appShell.expectRoleView(phase1Roles.employee)
  })

  test('check #5: role switch updates route without full page reload', async ({
    page,
    appShell,
  }) => {
    const markerBefore = await page.evaluate(() => {
      type WindowWithNavigationMarker = Window & { __pw_e2e_navigation_marker__?: string }
      const globalWindow = window as WindowWithNavigationMarker
      if (!globalWindow.__pw_e2e_navigation_marker__) {
        globalWindow.__pw_e2e_navigation_marker__ = crypto.randomUUID()
      }

      return globalWindow.__pw_e2e_navigation_marker__
    })

    await appShell.switchRole(phase1Roles.deliveryManager.label)
    const markerAfter = await page.evaluate(() => {
      type WindowWithNavigationMarker = Window & { __pw_e2e_navigation_marker__?: string }
      const globalWindow = window as WindowWithNavigationMarker
      return globalWindow.__pw_e2e_navigation_marker__
    })

    expect(markerAfter).toBe(markerBefore)
    await appShell.expectRoleView(phase1Roles.deliveryManager)
  })

  test('check #6: each role shows only its own navigation item', async ({ appShell }) => {
    await appShell.expectRoleView(phase1Roles.unitManager)
    await expect(appShell.navLink('Resourcing Requests')).toHaveCount(0)
    await expect(appShell.navLink('My Profile')).toHaveCount(0)

    await appShell.switchRole(phase1Roles.deliveryManager.label)
    await appShell.expectRoleView(phase1Roles.deliveryManager)
    await expect(appShell.navLink('Dashboard')).toHaveCount(0)
    await expect(appShell.navLink('My Profile')).toHaveCount(0)

    await appShell.switchRole(phase1Roles.employee.label)
    await appShell.expectRoleView(phase1Roles.employee)
    await expect(appShell.navLink('Dashboard')).toHaveCount(0)
    await expect(appShell.navLink('Resourcing Requests')).toHaveCount(0)
  })
})
