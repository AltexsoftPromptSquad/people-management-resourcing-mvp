import { phase5Baselines, phase5Routes } from '../fixtures/phase5-data'
import { selectCustomOption } from '../support/select'
import { expect, test } from '../support/test'

test.describe('Phase 5 - inline edit', () => {
  test('P5-IE01: Unit Manager can edit Bench Status inline', async ({ page, appShell }) => {
    await page.goto(phase5Routes.customLists)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase5Routes.customLists)

    await page.getByRole('tab', { name: 'Bench' }).click()

    const targetRow = page
      .getByRole('row')
      .filter({ hasText: phase5Baselines.employeeFullName })
      .first()

    await expect(targetRow).toBeVisible()

    await targetRow.getByText('Available').first().click()
    await selectCustomOption(targetRow.getByRole('combobox'), 'Interviewing')

    await expect(targetRow.getByRole('combobox')).toHaveCount(0)
    await expect(targetRow.locator('td', { hasText: 'Interviewing' })).toBeVisible()
  })
})
