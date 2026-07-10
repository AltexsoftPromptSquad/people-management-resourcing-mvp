import { getRisksPagePath } from '../../../src/app/routes'
import { getSubordinatesForManager } from '../../../src/mocks/services/manager-data-service'
import { expect, test } from '../support/test'

const managerId = 'person-um-001'
const atRiskSubordinates = getSubordinatesForManager(managerId).filter(
  (person) => person.riskLevel !== 'None',
)

test.describe('Risks page (FR-DB-007)', () => {
  test('RISK01: Unit Manager sees at-risk subordinates instead of the placeholder', async ({
    page,
    appShell,
  }) => {
    await page.goto(getRisksPagePath())
    await appShell.switchRole('Unit Manager')
    await page.goto(getRisksPagePath())

    await expect(page.getByRole('heading', { level: 1, name: 'Risks' })).toBeVisible()
    await expect(page.getByText('Dedicated risks view coming in Phase 3')).toHaveCount(0)

    expect(atRiskSubordinates.length).toBeGreaterThan(0)
    await expect(page.locator('tbody tr')).toHaveCount(atRiskSubordinates.length)

    const firstAtRisk = atRiskSubordinates[0]
    if (firstAtRisk) {
      await expect(page.getByRole('button', { name: firstAtRisk.fullName })).toBeVisible()
    }
  })

  test('RISK02: no row shows a None risk level', async ({ page, appShell }) => {
    await page.goto(getRisksPagePath())
    await appShell.switchRole('Unit Manager')
    await page.goto(getRisksPagePath())

    await expect(page.locator('tbody tr').first()).toBeVisible()
    await expect(page.locator('tbody tr').filter({ hasText: 'None' })).toHaveCount(0)
  })
})
