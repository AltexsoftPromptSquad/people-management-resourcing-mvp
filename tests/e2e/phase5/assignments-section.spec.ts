import { phase5Routes } from '../fixtures/phase5-data'
import { expect, test } from '../support/test'

test.describe('Phase 5 - assignments section', () => {
  test('P5-AH01: Unit Manager can open assignments section as read-only view', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase5Routes.assignments)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase5Routes.assignments)

    await expect(page.getByRole('heading', { name: 'Assignments' })).toBeVisible()

    const table = page.getByRole('table')
    await expect(table).toBeVisible()
    await expect(page.getByRole('button', { name: /Edit/i })).toHaveCount(0)
  })
})
