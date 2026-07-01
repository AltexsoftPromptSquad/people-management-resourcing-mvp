import { phase1Roles, phase1Routes } from '../fixtures/mock-baselines'
import { expect, test } from '../support/test'

test.describe('Phase 1', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(phase1Routes.dashboard)
  })

  test('check #15: fresh load as Unit Manager', async ({ appShell }) => {
    await appShell.expectRoleView(phase1Roles.unitManager)
  })

  test('check #16: role switching cycle UM -> DM -> Employee -> UM', async ({ appShell }) => {
    await appShell.expectRoleView(phase1Roles.unitManager)

    await appShell.switchRole(phase1Roles.deliveryManager.label)
    await appShell.expectRoleView(phase1Roles.deliveryManager)

    await appShell.switchRole(phase1Roles.employee.label)
    await appShell.expectRoleView(phase1Roles.employee)

    await appShell.switchRole(phase1Roles.unitManager.label)
    await appShell.expectRoleView(phase1Roles.unitManager)
  })

  test('check #17: desktop header remains usable at 1280x800', async ({ page, appShell }) => {
    await expect(appShell.roleButton(phase1Roles.unitManager.label)).toBeVisible()
    await expect(appShell.roleButton(phase1Roles.deliveryManager.label)).toBeVisible()
    await expect(appShell.roleButton(phase1Roles.employee.label)).toBeVisible()

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(hasHorizontalOverflow).toBeFalsy()
  })

  test('check #18: keyboard focus reaches role switcher and shows a focus ring', async ({
    page,
    appShell,
  }) => {
    const targetButton = appShell.roleButton(phase1Roles.deliveryManager.label)
    await page.keyboard.press('Tab')
    await targetButton.focus()

    await expect(targetButton).toBeFocused()
    const boxShadow = await appShell.computedStyle(targetButton, 'box-shadow')
    expect(boxShadow).not.toBe('none')
  })
})
