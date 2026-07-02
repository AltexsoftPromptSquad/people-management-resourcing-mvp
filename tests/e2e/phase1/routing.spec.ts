import { phase1Roles, phase1Routes } from '../fixtures/mock-baselines'
import { test } from '../support/test'

test.describe('Phase 1', () => {
  test('check #7: root path redirects to Unit Manager landing page', async ({ page, appShell }) => {
    await page.goto(phase1Routes.root)
    await appShell.expectRoleView(phase1Roles.unitManager)
  })

  test('check #8: unknown route redirects to Unit Manager landing page', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase1Routes.unknown)
    await appShell.expectRoleView(phase1Roles.unitManager)
  })

  test('check #9: direct URL to wrong-role page redirects to active role landing', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase1Routes.myProfile)
    await appShell.expectRoleView(phase1Roles.unitManager)
  })

  test('check #10: browser back/forward works without broken state', async ({ page, appShell }) => {
    await page.goto(phase1Routes.dashboard)
    await appShell.switchRole(phase1Roles.deliveryManager.label)
    await appShell.expectRoleView(phase1Roles.deliveryManager)

    await page.goBack()
    await appShell.expectRoleView(phase1Roles.deliveryManager)

    await page.goForward()
    await appShell.expectRoleView(phase1Roles.deliveryManager)
  })
})
