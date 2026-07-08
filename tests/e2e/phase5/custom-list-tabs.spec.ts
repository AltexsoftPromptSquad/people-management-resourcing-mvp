import { phase5Baselines, phase5Routes } from '../fixtures/phase5-data'
import { expect, test } from '../support/test'

test.describe('Phase 5 - custom list tabs', () => {
  test('P5-CL01: seeded tabs are visible for Unit Manager', async ({ page, appShell }) => {
    await page.goto(phase5Routes.customLists)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase5Routes.customLists)

    await expect(page.getByRole('heading', { name: 'Custom Lists' })).toBeVisible()

    for (const listName of phase5Baselines.seededListNames) {
      await expect(page.getByRole('tab', { name: listName })).toBeVisible()
    }
  })
})
