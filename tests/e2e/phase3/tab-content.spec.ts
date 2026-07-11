import {
  overrideFetch,
  phase3Baselines,
  phase3Routes,
  type FetchOverrideRule,
} from '../fixtures/phase3-data'
import { EmployeeProfilePage } from '../page-objects/EmployeeProfilePage'
import { expect, test } from '../support/test'
import { people } from '../../../src/mocks/data/people'

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const formatPhone = (phone: string) => phone.replace(/\s*x\d+$/i, '').trim()

const getPersonName = (personId: string) => {
  const person = people.find((item) => item.id === personId)
  return person ? `${person.firstName} ${person.lastName}` : personId
}

const noEditOrDeleteControls = async (container: ReturnType<EmployeeProfilePage['tabPanel']>) => {
  await expect(container.getByRole('button', { name: /^Edit$/i })).toHaveCount(0)
  await expect(container.getByRole('button', { name: /^Delete$/i })).toHaveCount(0)
}

test.describe('Phase 3 - Overview tab content', () => {
  test('P3-O01/P3-O02: basic/contact/employment info and risk + action counts render', async ({
    page,
  }) => {
    const { employeePerson, risksForEmployee, openActionItemsForEmployee } = phase3Baselines
    await page.goto(phase3Routes.profile)

    const basicInfo = new EmployeeProfilePage(page).section('Basic Information')
    await expect(
      basicInfo.getByText(`Personal email: ${employeePerson.personalEmail}`),
    ).toBeVisible()
    await expect(
      basicInfo.getByText(`Personal phone: ${formatPhone(employeePerson.personalPhone)}`),
    ).toBeVisible()
    await expect(
      basicInfo.getByText(
        `Address: ${employeePerson.address.addressLine}, ${employeePerson.address.city}, ${employeePerson.address.country}`,
      ),
    ).toBeVisible()
    await expect(
      basicInfo.getByText(`Employment type: ${employeePerson.employmentType}`),
    ).toBeVisible()
    await expect(basicInfo.getByText(`English level: ${employeePerson.englishLevel}`)).toBeVisible()
    await expect(
      basicInfo.getByText(`Current status: ${employeePerson.currentProjectStatus}`),
    ).toBeVisible()
    await expect(basicInfo.getByText(`Risk count: ${risksForEmployee.length}`)).toBeVisible()
    await expect(
      basicInfo.getByText(`Open action items: ${openActionItemsForEmployee.length}`),
    ).toBeVisible()
  })

  test('P3-O03/P3-O04: Scheduled Leaves section lists type, dates, and status', async ({
    page,
  }) => {
    const { scheduledLeavesForEmployee } = phase3Baselines
    test.skip(scheduledLeavesForEmployee.length === 0, 'Requires seeded scheduled leaves')

    await page.goto(phase3Routes.profile)
    const leaves = new EmployeeProfilePage(page).section('Scheduled Leaves')

    for (const leave of scheduledLeavesForEmployee) {
      const row = leaves.getByRole('listitem').filter({
        hasText: `${leave.leaveType}: ${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}`,
      })
      await expect(row).toBeVisible()
      await expect(row.getByText(leave.status, { exact: true })).toBeVisible()
    }
  })

  test('P3-O05: Scheduled Leaves shows an empty state when there are no leaves', async ({
    page,
  }) => {
    await page.addInitScript(overrideFetch, [
      { urlIncludes: '/scheduled-leaves', respondWith: { status: 200, body: [] } },
    ] satisfies FetchOverrideRule[])
    await page.goto(phase3Routes.profile)

    const leaves = new EmployeeProfilePage(page).section('Scheduled Leaves')
    await expect(leaves.getByText('No scheduled leaves')).toBeVisible()
    await expect(leaves.getByText('Scheduled leave records will appear here.')).toBeVisible()
  })
})

test.describe('Phase 3 - Job and Skills tab content', () => {
  test('P3-J01: position, grade, unit, manager, hire date, employment status, work location, and English level render', async ({
    page,
  }) => {
    const { employeePerson, employeeUnitName, employeeManagerName } = phase3Baselines
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Job and Skills')

    const details = profile.section('Employment Details')
    await expect(details.getByText(`Position: ${employeePerson.position}`)).toBeVisible()
    await expect(details.getByText(`Grade: ${employeePerson.grade}`)).toBeVisible()
    await expect(details.getByText(`Unit: ${employeeUnitName}`)).toBeVisible()
    await expect(details.getByText(`Manager: ${employeeManagerName}`)).toBeVisible()
    await expect(
      details.getByText(`Hire date: ${formatDate(employeePerson.hireDate)}`),
    ).toBeVisible()
    await expect(
      details.getByText(`Employment status: ${employeePerson.employmentStatus}`),
    ).toBeVisible()
    await expect(details.getByText(`Work location: ${employeePerson.workLocation}`)).toBeVisible()

    const englishSection = profile.section('English Level')
    await expect(
      englishSection.getByText(employeePerson.englishLevel, { exact: true }),
    ).toBeVisible()
  })

  test('P3-J02: skills list renders with level values', async ({ page }) => {
    const { skillsForEmployee } = phase3Baselines
    test.skip(skillsForEmployee.length === 0, 'Requires seeded skills')

    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Job and Skills')

    const skillsSection = profile.section('Skills')
    for (const skill of skillsForEmployee) {
      await expect(skillsSection.getByText(`${skill.name} - ${skill.level}`)).toBeVisible()
    }
  })
})

test.describe('Phase 3 - Risks and Action Items tab content', () => {
  test('P3-K01: risk history entries render with their levels', async ({ page }) => {
    const { risksForEmployee } = phase3Baselines
    test.skip(risksForEmployee.length === 0, 'Requires seeded risks')

    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Risks and Action Items')

    const riskHistory = profile.section('Risk History')
    for (const risk of risksForEmployee) {
      const row = riskHistory.getByRole('listitem').filter({ hasText: risk.description })
      await expect(row).toBeVisible()
      await expect(row.getByText(risk.level, { exact: true })).toBeVisible()
    }
  })

  test('P3-K01: risk notes (management notes) render on the managerial profile', async ({
    page,
  }) => {
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Risks and Action Items')

    const notes = profile.section('Management Notes')
    await expect(notes).toBeVisible()
    const expectedText = phase3Baselines.employeePerson.managementNotes ?? 'No manager notes.'
    await expect(notes.getByText(expectedText)).toBeVisible()
  })

  test('P3-K02: open and closed action items render for the person', async ({ page }) => {
    const { actionItemsForEmployee } = phase3Baselines
    test.skip(actionItemsForEmployee.length === 0, 'Requires seeded action items')

    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Risks and Action Items')

    const actionItemsSection = profile.section('Action Items')
    await expect(actionItemsSection.getByRole('listitem')).toHaveCount(
      actionItemsForEmployee.length,
    )

    for (const item of actionItemsForEmployee) {
      const row = actionItemsSection
        .getByRole('listitem')
        .filter({ hasText: item.title })
        .filter({ hasText: formatDate(item.dueDate) })
      await expect(row).toBeVisible()
      await expect(row).toContainText(`Due ${formatDate(item.dueDate)} - ${item.status}`)
    }
  })

  test('P3-K03: risks and action items show empty states when there is no data', async ({
    page,
  }) => {
    await page.addInitScript(overrideFetch, [
      { urlIncludes: '/risks', respondWith: { status: 200, body: [] } },
      { urlIncludes: '/action-items', respondWith: { status: 200, body: [] } },
    ] satisfies FetchOverrideRule[])
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Risks and Action Items')

    const riskHistory = profile.section('Risk History')
    await expect(riskHistory.getByText('No risks recorded')).toBeVisible()
    await expect(
      riskHistory.getByText('Risk entries for this employee will appear here.'),
    ).toBeVisible()

    const actionItemsSection = profile.section('Action Items')
    await expect(actionItemsSection.getByText('No action items')).toBeVisible()
    await expect(
      actionItemsSection.getByText('Action items assigned to this employee will appear here.'),
    ).toBeVisible()
  })
})

test.describe('Phase 3 - Feedbacks tab content', () => {
  test('P3-F01/P3-F02: feedback entries render newest first with type, content, author, and date', async ({
    page,
  }) => {
    const { feedbacksForEmployee } = phase3Baselines
    expect(feedbacksForEmployee.length).toBeGreaterThanOrEqual(2)

    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Feedbacks')

    const items = profile.tabPanel().getByRole('listitem')
    await expect(items).toHaveCount(feedbacksForEmployee.length)

    for (const [index, feedback] of feedbacksForEmployee.entries()) {
      const row = items.nth(index)
      await expect(row).toContainText(feedback.type)
      await expect(row).toContainText(feedback.content)
      await expect(row).toContainText(formatDate(feedback.createdAt))
      await expect(row).toContainText(getPersonName(feedback.authorId))
    }
  })

  test('P3-F10: saved feedback entries are read-only (no edit/delete controls)', async ({
    page,
  }) => {
    const { feedbacksForEmployee } = phase3Baselines
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Feedbacks')
    await expect(profile.tabPanel().getByRole('listitem')).toHaveCount(feedbacksForEmployee.length)

    await noEditOrDeleteControls(profile.tabPanel())
  })

  test('P3-F11: Feedbacks tab shows an empty state when there is no feedback', async ({ page }) => {
    await page.addInitScript(overrideFetch, [
      { urlIncludes: '/feedbacks', respondWith: { status: 200, body: [] } },
    ] satisfies FetchOverrideRule[])
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Feedbacks')

    await expect(profile.tabPanel().getByText('No feedback recorded')).toBeVisible()
    await expect(
      profile.tabPanel().getByText('Feedback entries for this employee will appear here.'),
    ).toBeVisible()
  })
})

test.describe('Phase 3 - Resourcing History and Project History tabs', () => {
  test('P3-RH01/P3-RH03: Resourcing History shows assignment history only, distinct from Project History', async ({
    page,
  }) => {
    const { assignmentHistoryForEmployee, projectHistoryForEmployee } = phase3Baselines
    test.skip(assignmentHistoryForEmployee.length === 0, 'Requires seeded assignment history')

    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Resourcing History')

    const panel = profile.tabPanel()
    for (const item of assignmentHistoryForEmployee) {
      const row = panel.getByRole('listitem').filter({
        hasText: `Request: ${item.requestTitle ?? item.requestId}`,
      })
      await expect(row).toBeVisible()
      await expect(row.getByText(item.status)).toBeVisible()
      await expect(row.getByText(`Proposed: ${formatDate(item.proposedAt)}`)).toBeVisible()
      await expect(row.getByText(item.proposedById)).toBeVisible()
    }

    for (const item of projectHistoryForEmployee) {
      await expect(panel.getByText(item.projectName)).toHaveCount(0)
    }
    await noEditOrDeleteControls(panel)
  })

  test('P3-RH02/P3-RH03: Project History shows project history only, distinct from Resourcing History', async ({
    page,
  }) => {
    const { projectHistoryForEmployee, assignmentHistoryForEmployee } = phase3Baselines
    test.skip(projectHistoryForEmployee.length === 0, 'Requires seeded project history')

    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Project History')

    const panel = profile.tabPanel()
    for (const item of projectHistoryForEmployee) {
      await expect(panel.getByText(item.projectName)).toBeVisible()
    }

    for (const item of assignmentHistoryForEmployee) {
      await expect(panel.getByText(`Request: ${item.requestId}`)).toHaveCount(0)
    }
  })

  test('P3-RH04: Resourcing History is read-only', async ({ page }) => {
    const { assignmentHistoryForEmployee } = phase3Baselines
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Resourcing History')

    if (assignmentHistoryForEmployee.length > 0) {
      await expect(profile.tabPanel().getByRole('listitem')).toHaveCount(
        assignmentHistoryForEmployee.length,
      )
    } else {
      await expect(profile.tabPanel().getByText('No resourcing history')).toBeVisible()
    }

    await noEditOrDeleteControls(profile.tabPanel())
  })

  test('P3-RH05: Resourcing History and Project History show empty states independently', async ({
    page,
  }) => {
    await page.addInitScript(overrideFetch, [
      { urlIncludes: '/assignment-history', respondWith: { status: 200, body: [] } },
      { urlIncludes: '/project-history', respondWith: { status: 200, body: [] } },
    ] satisfies FetchOverrideRule[])
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)

    await profile.openTab('Resourcing History')
    await expect(profile.tabPanel().getByText('No resourcing history')).toBeVisible()
    await expect(
      profile
        .tabPanel()
        .getByText('Assignment history records will appear here after a resourcing decision.'),
    ).toBeVisible()

    await profile.openTab('Project History')
    await expect(profile.tabPanel().getByText('No project history')).toBeVisible()
    await expect(
      profile.tabPanel().getByText('Project history records will appear here.'),
    ).toBeVisible()
  })
})

test.describe('Phase 3 - Documents and IDP tab content', () => {
  test('P3-D01/P3-D02: documents list and IDP status render', async ({ page }) => {
    const { documentsForEmployee, idpRecordForEmployee } = phase3Baselines
    test.skip(documentsForEmployee.length === 0, 'Requires seeded documents')

    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Documents and IDP')

    const idpSection = profile.section('IDP Reference')
    await expect(idpSection.getByText(idpRecordForEmployee.documentReference)).toBeVisible()
    await expect(idpSection.getByText(idpRecordForEmployee.status, { exact: true })).toBeVisible()

    const panel = profile.tabPanel()
    for (const document of documentsForEmployee) {
      const row = panel.locator('li').filter({ hasText: document.name })
      await expect(row).toContainText(document.type)
      await expect(row).toContainText(document.visibility)
      await expect(row).toContainText(formatDate(document.uploadedAt))
    }
  })

  test('P3-D03: Documents and IDP shows an empty state when there are no documents', async ({
    page,
  }) => {
    await page.addInitScript(overrideFetch, [
      { urlIncludes: '/documents', respondWith: { status: 200, body: [] } },
    ] satisfies FetchOverrideRule[])
    await page.goto(phase3Routes.profile)
    const profile = new EmployeeProfilePage(page)
    await profile.openTab('Documents and IDP')

    await expect(profile.tabPanel().getByText('No documents')).toBeVisible()
    await expect(
      profile.tabPanel().getByText('Document records for this employee will appear here.'),
    ).toBeVisible()
  })
})
