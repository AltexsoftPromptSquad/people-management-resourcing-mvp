import { getProfilePathFor, phase2Baselines, phase2Routes } from '../fixtures/phase2-data'
import { SubordinatesPage } from '../page-objects/SubordinatesPage'
import { selectCustomOption } from '../support/select'
import { expect, test } from '../support/test'

const waitForDebounce = async (pageUrlReader: () => string, delayMs: number) => {
  // Buffer is generous beyond the debounce delay itself so the poll doesn't
  // flake under slower/parallel CI runs where rendering and URL updates lag.
  await expect
    .poll(
      () => {
        return pageUrlReader()
      },
      { timeout: delayMs + 4000 },
    )
    .toBeTruthy()
}

test.describe('Phase 2 - subordinates list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(phase2Routes.subordinates)
  })

  test('P2-S01/P2-S02: scoped list and required columns render', async ({ page }) => {
    const subordinates = new SubordinatesPage(page)
    await subordinates.expectLoaded()

    await expect(subordinates.rows()).toHaveCount(
      Math.min(25, phase2Baselines.managerSubordinates.length),
    )
    await expect(subordinates.paginationSummary()).toHaveText(
      `Showing 1-25 of ${phase2Baselines.managerSubordinates.length}`,
    )
    await expect(page.getByRole('button', { name: 'Olena Kovalenko' })).toHaveCount(0)

    await expect(page.getByRole('columnheader', { name: /Name/ })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /Position/ })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /Grade/ })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /Status/ })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /Risk/ })).toBeVisible()
  })

  test('P2-S03/P2-S04: sorting toggles order and persists in URL', async ({ page }) => {
    const subordinates = new SubordinatesPage(page)
    await subordinates.expectLoaded()

    await subordinates.headerSortButton('Name').click()
    await expect(page).toHaveURL(/sortDirection=desc/)
    await expect(subordinates.headerSortButton('Name')).toHaveText(/Name ↓/)
    expect(new URL(page.url()).searchParams.get('sortField')).toBeNull()
    expect(new URL(page.url()).searchParams.get('sortDirection')).toBe('desc')

    await subordinates.headerSortButton('Name').click()
    await expect(page).toHaveURL(/\/subordinates$/)
    await expect(subordinates.headerSortButton('Name')).toHaveText(/Name ↑/)

    const sortableColumns = [
      { label: 'Position', field: 'position' },
      { label: 'Grade', field: 'grade' },
      { label: 'Status', field: 'currentStatus' },
      { label: 'Risk', field: 'riskLevel' },
    ] as const

    for (const column of sortableColumns) {
      await subordinates.headerSortButton(column.label).click()
      await expect(page).toHaveURL(new RegExp(`sortField=${column.field}`))
      await expect(subordinates.headerSortButton(column.label)).toHaveText(
        new RegExp(`${column.label} ↑`),
      )
      expect(new URL(page.url()).searchParams.get('sortField')).toBe(column.field)
      expect(new URL(page.url()).searchParams.get('sortDirection') ?? 'asc').toBe('asc')
    }

    await subordinates.headerSortButton('Status').click()
    await expect(page).toHaveURL(/sortField=currentStatus/)
    await expect(subordinates.headerSortButton('Status')).toHaveText(/Status ↑/)
    await expect(subordinates.updatingOverlay()).toHaveCount(0)
    await subordinates.headerSortButton('Status').click()
    await expect
      .poll(() => new URL(page.url()).searchParams.get('sortDirection') ?? '')
      .toBe('desc')
    await expect(subordinates.headerSortButton('Status')).toHaveText(/Status ↓/)
    expect(new URL(page.url()).searchParams.get('sortDirection')).toBe('desc')
  })

  test('P2-S05/P2-S06/P2-S07: risk, status, position, and grade filters narrow rows', async ({
    page,
  }) => {
    const subordinates = new SubordinatesPage(page)
    await subordinates.expectLoaded()

    await selectCustomOption(subordinates.riskSelect(), phase2Baselines.filterValues.riskLevel)
    await expect
      .poll(() => new URL(page.url()).searchParams.get('riskLevel') ?? '')
      .toBe(phase2Baselines.filterValues.riskLevel)
    await expect
      .poll(async () => {
        const riskValues = await subordinates.rows().locator('td:nth-child(5)').allTextContents()
        return [...new Set(riskValues.map((value) => value.trim()))]
      })
      .toEqual([phase2Baselines.filterValues.riskLevel])

    await selectCustomOption(
      subordinates.statusSelect(),
      phase2Baselines.filterValues.currentStatus,
    )
    await expect
      .poll(() => new URL(page.url()).searchParams.get('currentStatus') ?? '')
      .toBe(phase2Baselines.filterValues.currentStatus)
    await expect
      .poll(async () => {
        const statusValues = await subordinates.rows().locator('td:nth-child(4)').allTextContents()
        return [...new Set(statusValues.map((value) => value.trim()))]
      })
      .toEqual([phase2Baselines.filterValues.currentStatus])

    await selectCustomOption(subordinates.positionSelect(), phase2Baselines.filterValues.position)
    await expect
      .poll(() => new URL(page.url()).searchParams.get('position') ?? '')
      .toBe(phase2Baselines.filterValues.position)

    await selectCustomOption(subordinates.gradeSelect(), phase2Baselines.filterValues.grade)
    await expect
      .poll(() => new URL(page.url()).searchParams.get('grade') ?? '')
      .toBe(phase2Baselines.filterValues.grade)
    await expect
      .poll(async () => {
        const rowCount = await subordinates.rows().count()
        if (rowCount > 0) {
          return true
        }

        return page.getByText('No subordinates match the current filters').isVisible()
      })
      .toBeTruthy()
  })

  test('P2-S08/P2-S09: search is debounced and filters by name', async ({ page }) => {
    const subordinates = new SubordinatesPage(page)
    await subordinates.expectLoaded()

    await subordinates.searchInput().fill(phase2Baselines.filterValues.searchToken)
    expect(new URL(page.url()).searchParams.get('search')).toBeNull()

    await waitForDebounce(() => new URL(page.url()).searchParams.get('search') ?? '', 500)
    expect(new URL(page.url()).searchParams.get('search')).toBe(
      phase2Baselines.filterValues.searchToken,
    )

    await expect
      .poll(async () => {
        const names = await subordinates.rows().locator('td:nth-child(1) button').allTextContents()
        return names.every((name) =>
          name.toLowerCase().includes(phase2Baselines.filterValues.searchToken.toLowerCase()),
        )
      })
      .toBeTruthy()
  })

  test('P2-S11: empty state renders for filter combinations with zero matches', async ({
    page,
  }) => {
    const subordinates = new SubordinatesPage(page)
    await subordinates.expectLoaded()

    await subordinates.searchInput().fill('zzzzzz-phase-2-no-match')
    await waitForDebounce(() => new URL(page.url()).searchParams.get('search') ?? '', 500)

    await expect(page.getByText('No subordinates match the current filters')).toBeVisible()
  })

  test('P2-S12: row click opens profile route', async ({ page }) => {
    const subordinates = new SubordinatesPage(page)
    await subordinates.expectLoaded()
    await subordinates.searchForPerson(phase2Baselines.profileTarget.fullName)

    await page.getByRole('button', { name: phase2Baselines.profileTarget.fullName }).first().click()
    await expect(page).toHaveURL(getProfilePathFor(phase2Baselines.profileTarget.id))
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: phase2Baselines.profileTarget.fullName,
      }),
    ).toBeVisible()
  })

  test('P2-S10: loading state appears while subordinates query is pending', async ({ page }) => {
    await page.addInitScript(() => {
      const originalFetch = window.fetch.bind(window)
      window.fetch = async (input, init) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url

        if (url.includes('/api/subordinates')) {
          await new Promise((resolve) => setTimeout(resolve, 900))
        }

        return originalFetch(input, init)
      }
    })

    const reload = page.reload()
    await expect(page.locator('section[aria-busy="true"]')).toContainText('Loading subordinates')
    await reload

    const subordinates = new SubordinatesPage(page)
    await subordinates.expectLoaded()
  })

  test('P2-S13: error state appears when subordinates endpoint fails', async ({ page }) => {
    await page.addInitScript(() => {
      const originalFetch = window.fetch.bind(window)
      window.fetch = async (input, init) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url

        if (url.includes('/api/subordinates')) {
          return new Response(
            JSON.stringify({ message: 'Injected subordinate loading failure for e2e coverage.' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }

        return originalFetch(input, init)
      }
    })

    await page.reload()
    const alertState = page.getByRole('alert')
    await expect(alertState).toBeVisible()
    await expect(alertState).toContainText('Something went wrong')
    await expect(alertState).toContainText(
      'Mock data could not be loaded. Try refreshing the page.',
    )
  })

  test('P2-S15: deep links with filters/sort are applied on first render', async ({ page }) => {
    const deepLink = `${phase2Routes.subordinates}?riskLevel=${phase2Baselines.filterValues.riskLevel}&sortField=grade&sortDirection=desc`
    await page.goto(deepLink)

    const subordinates = new SubordinatesPage(page)
    await subordinates.expectLoaded()
    await expect(subordinates.riskSelect()).toContainText(phase2Baselines.filterValues.riskLevel)
    await expect(subordinates.headerSortButton('Grade')).toHaveText(/Grade ↓/)
    await expect(subordinates.rows()).not.toHaveCount(0)
  })
})
