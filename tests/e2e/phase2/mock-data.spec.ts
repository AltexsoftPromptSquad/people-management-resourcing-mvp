import type { Page } from '@playwright/test'
import { phase2Baselines, phase2EndpointExpectations, phase2Routes } from '../fixtures/phase2-data'
import { expect, test } from '../support/test'

const waitForMsw = async (page: Page) => {
  await expect
    .poll(async () => page.evaluate(() => navigator.serviceWorker.controller?.scriptURL ?? ''))
    .toContain('/mockServiceWorker.js')
}

test.describe('Phase 2 - mock data and endpoints', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(phase2Routes.dashboard)
    await waitForMsw(page)
  })

  test('P2-M01/P2-M02/P2-M03/P2-M12: people endpoints return deterministic seeded data', async ({
    page,
  }) => {
    const response = await page.evaluate(async () => {
      const [allPeople, unitPeople, managerPeople, firstPeople, secondPeople] = await Promise.all([
        fetch('/api/people').then(async (res) => (await res.json()) as Array<{ id: string }>),
        fetch('/api/people?unitId=unit-platform').then(
          async (res) => (await res.json()) as Array<{ unitId: string }>,
        ),
        fetch('/api/people?managerId=person-um-001').then(
          async (res) => (await res.json()) as Array<{ managerId?: string }>,
        ),
        fetch('/api/people').then(async (res) => (await res.json()) as Array<{ id: string }>),
        fetch('/api/people').then(async (res) => (await res.json()) as Array<{ id: string }>),
      ])

      return {
        allCount: allPeople.length,
        unitCount: unitPeople.length,
        managerCount: managerPeople.length,
        allUnitScoped: unitPeople.every((person) => person.unitId === 'unit-platform'),
        allManagerScoped: managerPeople.every((person) => person.managerId === 'person-um-001'),
        firstIds: firstPeople.map((person) => person.id),
        secondIds: secondPeople.map((person) => person.id),
      }
    })

    expect(response.allCount).toBe(phase2EndpointExpectations.peopleTotal)
    expect(response.allCount).toBeGreaterThanOrEqual(500)
    expect(response.unitCount).toBe(phase2EndpointExpectations.unitScopedPeopleTotal)
    expect(response.managerCount).toBe(phase2EndpointExpectations.managerScopedPeopleTotal)
    expect(response.allUnitScoped).toBeTruthy()
    expect(response.allManagerScoped).toBeTruthy()
    expect(response.firstIds).toEqual(response.secondIds)
  })

  test('P2-M04/P2-M05/P2-M06/P2-M07: manager-focused endpoints validate required query params', async ({
    page,
  }) => {
    const response = await page.evaluate(async () => {
      const person = await fetch('/api/people/person-um-001').then(async (res) => ({
        status: res.status,
        body: (await res.json()) as { id: string },
      }))
      const person404 = await fetch('/api/people/non-existent').then(async (res) => ({
        status: res.status,
        body: (await res.json()) as { message?: string },
      }))
      const summary = await fetch('/api/dashboard/summary?managerId=person-um-001').then(
        async (res) => ({
          status: res.status,
          body: (await res.json()) as { subordinateCount: number },
        }),
      )
      const summaryMissing = await fetch('/api/dashboard/summary').then(async (res) => ({
        status: res.status,
      }))
      const actionItems = await fetch('/api/dashboard/action-items?managerId=person-um-001').then(
        async (res) => ({
          status: res.status,
          body: (await res.json()) as Array<{ dueDate: string }>,
        }),
      )
      const actionItemsMissing = await fetch('/api/dashboard/action-items').then(async (res) => ({
        status: res.status,
      }))
      const subordinates = await fetch('/api/subordinates?managerId=person-um-001').then(
        async (res) => ({
          status: res.status,
          body: (await res.json()) as Array<{ id: string }>,
        }),
      )
      const subordinatesMissing = await fetch('/api/subordinates').then(async (res) => ({
        status: res.status,
      }))

      return {
        person,
        person404,
        summary,
        summaryMissing,
        actionItems,
        actionItemsMissing,
        subordinates,
        subordinatesMissing,
      }
    })

    expect(response.person.status).toBe(200)
    expect(response.person.body.id).toBe('person-um-001')
    expect(response.person404.status).toBe(404)
    expect(response.person404.body.message).toContain('Person not found')

    expect(response.summary.status).toBe(200)
    expect(response.summary.body.subordinateCount).toBe(
      phase2Baselines.dashboardSummary.subordinateCount,
    )
    expect(response.summaryMissing.status).toBe(400)

    expect(response.actionItems.status).toBe(200)
    expect(response.actionItemsMissing.status).toBe(400)
    const sortedDates = [...response.actionItems.body].map((item) => item.dueDate)
    expect(sortedDates).toEqual([...sortedDates].sort())

    expect(response.subordinates.status).toBe(200)
    expect(response.subordinates.body.length).toBe(phase2Baselines.managerSubordinates.length)
    expect(response.subordinatesMissing.status).toBe(400)
  })

  test('P2-M08/P2-M17: person-scoped sub-resources are available and scoped correctly', async ({
    page,
  }) => {
    const response = await page.evaluate(async () => {
      const personId = 'person-employee-001'
      const [feedback, leaves, risks, actionItems, projectHistory, assignmentHistory] =
        await Promise.all([
          fetch(`/api/people/${personId}/feedbacks`).then(
            async (res) => (await res.json()) as Array<{ personId: string }>,
          ),
          fetch(`/api/people/${personId}/scheduled-leaves`).then(
            async (res) => (await res.json()) as Array<{ personId: string }>,
          ),
          fetch(`/api/people/${personId}/risks`).then(
            async (res) => (await res.json()) as Array<{ personId: string }>,
          ),
          fetch(`/api/people/${personId}/action-items`).then(
            async (res) => (await res.json()) as Array<{ personId: string }>,
          ),
          fetch(`/api/people/${personId}/project-history`).then(
            async (res) => (await res.json()) as Array<{ personId: string }>,
          ),
          fetch(`/api/people/${personId}/assignment-history`).then(
            async (res) => (await res.json()) as Array<{ employeeId: string }>,
          ),
        ])

      return {
        feedback,
        leaves,
        risks,
        actionItems,
        projectHistory,
        assignmentHistory,
      }
    })

    expect(response.feedback.every((row) => row.personId === 'person-employee-001')).toBeTruthy()
    expect(response.leaves.every((row) => row.personId === 'person-employee-001')).toBeTruthy()
    expect(response.risks.every((row) => row.personId === 'person-employee-001')).toBeTruthy()
    expect(response.actionItems.every((row) => row.personId === 'person-employee-001')).toBeTruthy()
    expect(
      response.projectHistory.every((row) => row.personId === 'person-employee-001'),
    ).toBeTruthy()
    expect(
      response.assignmentHistory.every((row) => row.employeeId === 'person-employee-001'),
    ).toBeTruthy()
    expect(response.projectHistory.length).toBeGreaterThan(0)
  })

  test('P2-M09: feedback creation endpoint returns 201 and generated record', async ({ page }) => {
    const response = await page.evaluate(async () => {
      const payload = {
        authorId: 'person-um-001',
        type: 'General',
        content: 'Phase 2 automation feedback seed check.',
        visibility: 'Shareable',
      }

      const res = await fetch('/api/people/person-employee-001/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      return {
        status: res.status,
        body: (await res.json()) as { id: string; personId: string; content: string },
      }
    })

    expect(response.status).toBe(201)
    expect(response.body.id).toMatch(/^feedback-/)
    expect(response.body.personId).toBe('person-employee-001')
    expect(response.body.content).toContain('Phase 2 automation feedback')
  })

  test('P2-M10/P2-M11: list endpoints return expected seeded counts', async ({ page }) => {
    const response = await page.evaluate(async () => {
      const [allRequests, createdByDm, assignedToUm, allRisks, allActionItems] = await Promise.all([
        fetch('/api/resourcing/requests').then(
          async (res) => (await res.json()) as Array<{ id: string }>,
        ),
        fetch('/api/resourcing/requests?createdById=person-dm-001').then(
          async (res) => (await res.json()) as Array<{ createdById: string }>,
        ),
        fetch('/api/resourcing/requests?assignedManagerId=person-um-001').then(
          async (res) => (await res.json()) as Array<{ assignedUnitManagerId: string }>,
        ),
        fetch('/api/risks').then(async (res) => (await res.json()) as Array<{ id: string }>),
        fetch('/api/action-items').then(async (res) => (await res.json()) as Array<{ id: string }>),
      ])

      return {
        allRequestsCount: allRequests.length,
        createdByDmCount: createdByDm.length,
        assignedToUmCount: assignedToUm.length,
        allCreatedByDm: createdByDm.every((item) => item.createdById === 'person-dm-001'),
        allAssignedToUm: assignedToUm.every(
          (item) => item.assignedUnitManagerId === 'person-um-001',
        ),
        risksCount: allRisks.length,
        actionItemsCount: allActionItems.length,
      }
    })

    expect(response.allRequestsCount).toBe(phase2EndpointExpectations.resourcingRequestsTotal)
    expect(response.createdByDmCount).toBe(phase2EndpointExpectations.resourcingRequestsTotal)
    expect(response.assignedToUmCount).toBe(phase2Baselines.assignedRequestsForManager)
    expect(response.allCreatedByDm).toBeTruthy()
    expect(response.allAssignedToUm).toBeTruthy()
    expect(response.risksCount).toBe(phase2EndpointExpectations.risksTotal)
    expect(response.risksCount).toBeGreaterThanOrEqual(20)
    expect(response.actionItemsCount).toBe(phase2EndpointExpectations.actionItemsTotal)
    expect(response.actionItemsCount).toBeGreaterThanOrEqual(30)
  })

  test('P2-M13/P2-M14/P2-M15/P2-M16/P2-M18: seed quality and field completeness checks', async ({
    page,
  }) => {
    expect(phase2EndpointExpectations.peopleTotal).toBeGreaterThanOrEqual(500)
    expect(phase2EndpointExpectations.risksTotal).toBeGreaterThanOrEqual(20)
    expect(phase2EndpointExpectations.actionItemsTotal).toBeGreaterThanOrEqual(30)

    expect(phase2Baselines.feedbacksForDemoPersonas.um).toBeGreaterThanOrEqual(2)
    expect(phase2Baselines.feedbacksForDemoPersonas.dm).toBeGreaterThanOrEqual(2)
    expect(phase2Baselines.feedbacksForDemoPersonas.employee).toBeGreaterThanOrEqual(2)

    expect(phase2Baselines.scheduledLeavesForDemoPersonas.um).toBeGreaterThanOrEqual(1)
    expect(phase2Baselines.scheduledLeavesForDemoPersonas.dm).toBeGreaterThanOrEqual(1)
    expect(phase2Baselines.scheduledLeavesForDemoPersonas.employee).toBeGreaterThanOrEqual(1)
    expect(phase2Baselines.hasLeaveOverlap).toBeTruthy()

    expect(phase2Baselines.hasHighRisk).toBeTruthy()
    expect(phase2Baselines.hasCriticalRisk).toBeTruthy()
    expect(phase2Baselines.hasPastAndFutureActionDates).toBeTruthy()

    const requestFieldCompleteness = await page.evaluate(async () => {
      const requests = (await fetch('/api/resourcing/requests').then(async (res) =>
        res.json(),
      )) as Array<{
        clientName?: string
        requiredSkills: string[]
        startDate: string
        endDate: string
        title: string
        requestCode: string
      }>

      return requests.every(
        (requestItem) =>
          Boolean(requestItem.clientName) &&
          requestItem.requiredSkills.length > 0 &&
          Boolean(requestItem.startDate) &&
          Boolean(requestItem.endDate) &&
          Boolean(requestItem.title) &&
          Boolean(requestItem.requestCode),
      )
    })

    expect(phase2Baselines.resourcingRequestsTotal).toBeGreaterThanOrEqual(10)
    expect(phase2Baselines.activeRequestsForManager).toBeGreaterThanOrEqual(1)
    expect(requestFieldCompleteness).toBeTruthy()
  })
})
