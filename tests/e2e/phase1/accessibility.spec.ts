import { phase1Roles, phase1Routes } from '../fixtures/mock-baselines'
import { expect, test } from '../support/test'

test.describe('Phase 1:', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(phase1Routes.dashboard)
  })

  test('check #19: role switcher group has accessible label and pressed state', async ({
    appShell,
  }) => {
    await expect(appShell.roleGroup()).toBeVisible()
    await expect(appShell.roleButton(phase1Roles.unitManager.label)).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await appShell.switchRole(phase1Roles.employee.label)
    await expect(appShell.roleButton(phase1Roles.employee.label)).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  test('check #20: nav links expose visible focus styles', async ({ appShell }) => {
    const activeNavLink = appShell.navLink(phase1Roles.unitManager.navLabel)

    await activeNavLink.focus()
    await expect(activeNavLink).toBeFocused()

    const focusShadow = await appShell.computedStyle(activeNavLink, 'box-shadow')
    expect(focusShadow).not.toBe('none')
  })
})
