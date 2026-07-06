import {
  overrideFetch,
  phase3Baselines,
  phase3Routes,
  type FetchOverrideRule,
} from '../fixtures/phase3-data'
import { EmployeeProfilePage } from '../page-objects/EmployeeProfilePage'
import { expect, test } from '../support/test'

test.describe('Phase 3 - async states', () => {
  test('P3-AS01: profile shows a page-tier loading state while the person query is pending', async ({
    page,
  }) => {
    await page.addInitScript(overrideFetch, [
      {
        urlIncludes: `/api/people/${phase3Baselines.employeePerson.id}`,
        method: 'GET',
        delayMs: 800,
      },
    ] satisfies FetchOverrideRule[])

    const navigation = page.goto(phase3Routes.profile)
    await expect(page.getByText('Loading profile…')).toBeVisible()
    await navigation

    await expect(
      page.getByRole('heading', { level: 1, name: phase3Baselines.employeeFullName }),
    ).toBeVisible()
  })

  test('P3-AS02: profile shows an error state with a link back to Subordinates when the person query fails', async ({
    page,
  }) => {
    await page.addInitScript(overrideFetch, [
      {
        urlIncludes: `/api/people/${phase3Baselines.employeePerson.id}`,
        method: 'GET',
        respondWith: { status: 500, body: { message: 'Injected profile load failure.' } },
      },
    ] satisfies FetchOverrideRule[])

    await page.goto(phase3Routes.profile)

    const errorState = page.getByRole('alert')
    await expect(errorState).toBeVisible()
    await expect(errorState).toContainText('Could not load profile')
    await expect(errorState).toContainText('Refresh the page or return to the list.')
    await expect(page.getByRole('button', { name: 'Back to Subordinates' })).toBeVisible()
  })

  test('P3-AS03: an unvisited tab shows section-tier loading independently of the rest of the page', async ({
    page,
  }) => {
    // Use the Documents query, which is only enabled once the Documents and IDP tab is opened, so
    // the injected delay reliably surfaces the section-tier loading state (unlike Overview-tier
    // queries such as risks/action-items that fetch eagerly on first mount).
    await page.addInitScript(overrideFetch, [
      { urlIncludes: '/documents', method: 'GET', delayMs: 800 },
    ] satisfies FetchOverrideRule[])

    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.expectLoaded(phase3Baselines.employeeFullName)

    await profile.openTab('Documents and IDP')
    await expect(profile.tabPanel().getByText('Loading documents…')).toBeVisible()
    await expect(profile.tab('Documents and IDP')).toBeVisible()

    await expect(profile.tabPanel().getByRole('listitem').first()).toBeVisible({
      timeout: 10_000,
    })
  })

  test('P3-AS03: a tab section error does not crash the rest of the page', async ({ page }) => {
    await page.addInitScript(overrideFetch, [
      {
        urlIncludes: '/risks',
        method: 'GET',
        respondWith: { status: 500, body: { message: 'Injected risks load failure.' } },
      },
    ] satisfies FetchOverrideRule[])

    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Risks and Action Items')

    const riskHistory = profile.section('Risk History')
    await expect(riskHistory.getByRole('alert')).toContainText(
      'Could not load Risks and Action Items',
    )

    // The rest of the page remains usable: header, other tabs, and the Action Items
    // section (a different query) are unaffected by the Risks query failure.
    await expect(
      page.getByRole('heading', { level: 1, name: phase3Baselines.employeeFullName }),
    ).toBeVisible()
    await expect(profile.section('Action Items')).toBeVisible()
    await profile.openTab('Feedbacks')
    await expect(profile.tab('Feedbacks')).toHaveAttribute('aria-selected', 'true')
  })
})
