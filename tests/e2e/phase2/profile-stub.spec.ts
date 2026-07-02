import { getProfilePathFor, phase2Baselines, phase2Routes } from '../fixtures/phase2-data'
import { expect, test } from '../support/test'

test.describe('Phase 2 - employee profile route', () => {
  test('P2-P01/P2-P03: managerial profile renders and Phase 2 stub copy is absent', async ({
    page,
  }) => {
    await page.goto(getProfilePathFor(phase2Baselines.profileTarget.id))

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: phase2Baselines.profileTarget.fullName,
      }),
    ).toBeVisible()
    await expect(
      page.getByText(`Profile entry for ${phase2Baselines.profileTarget.id}`),
    ).toHaveCount(0)
    await expect(
      page.getByText('Full managerial profile tabs, editing, and history views'),
    ).toHaveCount(0)

    await expect(page.getByRole('tab', { name: 'Overview' })).toBeVisible()
    await expect(page.getByRole('tab')).toHaveCount(7)
  })

  test('P2-P02: Back button returns to previous route', async ({ page }) => {
    await page.goto(phase2Routes.subordinates)
    await page.getByRole('button', { name: phase2Baselines.profileTarget.fullName }).first().click()
    await expect(page).toHaveURL(getProfilePathFor(phase2Baselines.profileTarget.id))

    await page.getByRole('button', { name: 'Back', exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`${phase2Routes.subordinates}`))
    await expect(page.getByRole('heading', { level: 1, name: 'Subordinates' })).toBeVisible()
  })
})
