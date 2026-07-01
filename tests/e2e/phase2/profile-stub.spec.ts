import { getProfilePathFor, phase2Baselines, phase2Routes } from '../fixtures/phase2-data'
import { expect, test } from '../support/test'

test.describe('Phase 2 - employee profile stub', () => {
  test('P2-P01/P2-P03: profile stub renders and deferred profile UI is absent', async ({
    page,
  }) => {
    await page.goto(getProfilePathFor(phase2Baselines.profileTarget.id))

    await expect(page.getByRole('heading', { level: 1, name: 'Employee Profile' })).toBeVisible()
    await expect(
      page.getByText(`Profile entry for ${phase2Baselines.profileTarget.id}`),
    ).toBeVisible()
    await expect(
      page.getByText('Full managerial profile tabs, editing, and history views'),
    ).toBeVisible()

    await expect(page.getByRole('tab')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /Edit/i })).toHaveCount(0)
  })

  test('P2-P02: Back button returns to previous route', async ({ page }) => {
    await page.goto(phase2Routes.subordinates)
    await page.getByRole('button', { name: phase2Baselines.profileTarget.fullName }).first().click()
    await expect(page).toHaveURL(getProfilePathFor(phase2Baselines.profileTarget.id))

    await page.getByRole('button', { name: 'Back' }).click()
    await expect(page).toHaveURL(new RegExp(`${phase2Routes.subordinates}`))
    await expect(page.getByRole('heading', { level: 1, name: 'Subordinates' })).toBeVisible()
  })
})
