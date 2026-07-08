import { phase5Baselines, phase5Routes } from '../fixtures/phase5-data'
import { expect, test } from '../support/test'

test.describe('Phase 5 - list sharing', () => {
  test('P5-LS01: owner can open share sheet and select recipient manager', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase5Routes.customLists)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase5Routes.customLists)

    await page.getByRole('tab', { name: 'Bench' }).click()
    await page.getByRole('button', { name: 'Share List' }).click()

    await expect(page.getByRole('heading', { name: 'Share "Bench"' })).toBeVisible()

    const recipientCheckbox = page.getByRole('checkbox', {
      name: phase5Baselines.secondUnitManagerName,
    })
    await recipientCheckbox.check()
    await page.getByRole('dialog').getByRole('button', { name: 'Share', exact: true }).click()

    await expect(page.getByText('List sharing updated')).toBeVisible()
  })
})
