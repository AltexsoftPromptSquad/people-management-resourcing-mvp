import { phase3Baselines, phase3Routes } from '../fixtures/phase3-data'
import { EmployeeProfilePage } from '../page-objects/EmployeeProfilePage'
import { expect, test } from '../support/test'

test.describe('Phase 3 - managerial profile header', () => {
  test('P3-H01/P3-H02: header renders initials, name, position/grade, unit, manager, status, availability, and risk', async ({
    page,
  }) => {
    const { employeePerson, employeeUnitName, employeeManagerName, employeeFullName } =
      phase3Baselines

    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    const header = profile.header()

    const initials =
      `${employeePerson.firstName.charAt(0)}${employeePerson.lastName.charAt(0)}`.toUpperCase()

    const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    await expect(header.getByText(initials, { exact: true })).toBeVisible()
    await expect(header.getByRole('heading', { level: 1, name: employeeFullName })).toBeVisible()
    await expect(
      header.getByText(
        new RegExp(
          `${escapeRegExp(employeePerson.position)}.+${escapeRegExp(employeePerson.grade)}`,
        ),
      ),
    ).toBeVisible()
    await expect(
      header.getByText(
        new RegExp(
          `${escapeRegExp(employeeUnitName)}.+Manager:\\s*${escapeRegExp(employeeManagerName)}`,
        ),
      ),
    ).toBeVisible()
    await expect(
      header.getByText(`Availability: ${employeePerson.availabilityPercent}%`, { exact: true }),
    ).toBeVisible()
    await expect(
      header.getByText(employeePerson.currentProjectStatus, { exact: true }),
    ).toBeVisible()
    await expect(
      header.getByText(`Risk: ${employeePerson.riskLevel}`, { exact: true }),
    ).toBeVisible()
  })

  test('P3-H03: risk badge carries a text label, not color alone', async ({ page }) => {
    await page.goto(phase3Routes.profile)
    const header = new EmployeeProfilePage(page).header()

    await expect(
      header.getByText(`Risk: ${phase3Baselines.employeePerson.riskLevel}`, { exact: true }),
    ).toBeVisible()
  })

  test('P3-H04: "Generate Shared Profile" action is not present on the managerial header (deferred to Phase 4)', async ({
    page,
  }) => {
    await page.goto(phase3Routes.profile)

    await expect(page.getByRole('button', { name: /Generate Shared Profile/i })).toHaveCount(0)
  })
})
