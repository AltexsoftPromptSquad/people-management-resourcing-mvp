import { phase5Routes } from '../fixtures/phase5-data'
import { expect, test } from '../support/test'

test.describe('Phase 5 - list builder', () => {
  test('P5-LB01: Unit Manager can create a custom list and see new tab', async ({
    page,
    appShell,
  }) => {
    await page.goto(phase5Routes.customLists)
    await appShell.switchRole('Unit Manager')
    await page.goto(phase5Routes.customLists)

    const listName = `Bench QA ${Date.now()}`
    await page.getByRole('button', { name: 'New List' }).click()
    await expect(page.getByRole('heading', { name: 'New List' })).toBeVisible()

    await page.getByLabel('List name *').fill(listName)
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByRole('tab', { name: listName })).toBeVisible()
    await expect(page.getByRole('tab', { name: listName })).toHaveAttribute('aria-selected', 'true')
  })
})
