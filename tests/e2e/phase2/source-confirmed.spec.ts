import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { expect, test } from '../support/test'

const readRepoFile = async (relativePath: string) => {
  const absolutePath = path.join(process.cwd(), relativePath)
  return readFile(absolutePath, 'utf8')
}

const requiredPhase2TypeFiles = [
  'src/types/feedback.ts',
  'src/types/scheduled-leave.ts',
  'src/types/risk.ts',
  'src/types/action-item.ts',
  'src/types/assignment-history.ts',
  'src/types/project-history.ts',
  'src/types/document.ts',
  'src/types/idp.ts',
  'src/types/custom-field.ts',
  'src/types/custom-list.ts',
  'src/types/candidate-proposal.ts',
  'src/types/shared-profile.ts',
  'src/types/allocation.ts',
] as const

test.describe('Phase 2 - source-confirmed checks', () => {
  test('P2-T01/P2-T02/P2-T03/P2-T04/P2-T05: required types exist and remain strongly typed', async () => {
    const typeFileBodies = await Promise.all(
      requiredPhase2TypeFiles.map((filePath) => readRepoFile(filePath)),
    )
    expect(typeFileBodies).toHaveLength(requiredPhase2TypeFiles.length)
    typeFileBodies.forEach((body) => {
      expect(body).not.toMatch(/\bany\b/)
    })

    const personType = await readRepoFile('src/types/person.ts')
    ;[
      'workEmail',
      'personalEmail',
      'workPhone',
      'personalPhone',
      'dateOfBirth',
      'address',
      'emergencyContact',
      'employmentType',
      'employmentStatus',
      'englishLevel',
      'hireDate',
      'currentProjectStatus',
      'availabilityPercent',
      'customFieldValues',
    ].forEach((requiredField) => {
      expect(personType).toContain(`${requiredField}:`)
    })

    const requestType = await readRepoFile('src/types/resourcing-request.ts')
    expect(requestType).toContain('clientName?:')
    expect(requestType).toContain('businessReason?:')
    ;[
      'requiredSkills',
      'startDate',
      'endDate',
      'durationText',
      'priority',
      'expectedCompensationLevel',
      'workloadPercent',
    ].forEach((requiredField) => {
      expect(requestType).toContain(`${requiredField}:`)
    })

    const subordinatesApi = await readRepoFile('src/features/people/api/get-subordinates.ts')
    expect(subordinatesApi).toContain("from '@/types/subordinates-query'")
    expect(subordinatesApi).toContain('apiClient<SubordinateListItem[]>')

    const [peopleSeedData, risksSeedData] = await Promise.all([
      readRepoFile('src/mocks/data/people.ts'),
      readRepoFile('src/mocks/data/risks.ts'),
    ])
    expect(peopleSeedData).toContain('faker.seed(20260625)')
    expect(risksSeedData).toContain('faker.seed(20260625)')
  })

  test('P2-Q01/P2-Q02/P2-Q03: query key factories and query boundaries remain consistent', async () => {
    const queryKeysFile = await readRepoFile('src/lib/query/query-keys.ts')
    expect(queryKeysFile).toContain('people:')
    expect(queryKeysFile).toContain('person:')
    expect(queryKeysFile).toContain('feedbacks:')
    expect(queryKeysFile).toContain('scheduledLeaves:')
    expect(queryKeysFile).toContain('risks:')
    expect(queryKeysFile).toContain('actionItems:')
    expect(queryKeysFile).toContain('projectHistory:')
    expect(queryKeysFile).toContain('assignmentHistory:')
    expect(queryKeysFile).toContain('resourcingRequests:')
    expect(queryKeysFile).toContain('dashboardSummary')
    expect(queryKeysFile).toContain('dashboardActionItems')
    expect(queryKeysFile).toContain('subordinates:')
    expect(queryKeysFile).not.toContain('URLSearchParams')

    const subordinatesQueryHook = await readRepoFile(
      'src/features/people/hooks/use-subordinates-query.ts',
    )
    expect(subordinatesQueryHook).toContain('useQuery({')
    expect(subordinatesQueryHook).toContain('queryKey: queryKeys.subordinates')
    expect(subordinatesQueryHook).toContain('placeholderData: keepPreviousData')
    expect(subordinatesQueryHook).not.toContain('useRoleStore')
  })

  test('P2-AR01/P2-AR02/P2-AR03/P2-AR04/P2-AR05/P2-AR06: architecture layering is preserved', async () => {
    const dashboardPage = await readRepoFile('src/pages/dashboard-page/DashboardPage.tsx')
    expect(dashboardPage).toContain(
      "from '@/features/dashboard/components/dashboard-summary-cards'",
    )
    expect(dashboardPage).toContain("from '@/features/dashboard/components/dashboard-quick-links'")
    expect(dashboardPage).not.toContain("from '@/mocks/")

    const subordinatesPage = await readRepoFile('src/pages/subordinates-page/SubordinatesPage.tsx')
    expect(subordinatesPage).toContain("from '@/features/people/components/subordinates-filters'")
    expect(subordinatesPage).toContain("from '@/features/people/components/subordinates-table'")
    expect(subordinatesPage).toContain('const searchDebounceMs = 350')
    expect(subordinatesPage).toContain('aria-busy="true"')
    expect(subordinatesPage).not.toContain("from '@/mocks/")

    const dashboardApi = await readRepoFile(
      'src/features/dashboard/api/get-dashboard-action-items.ts',
    )
    expect(dashboardApi).toContain("from '@/lib/api/api-client'")
    expect(dashboardApi).not.toContain("from '@/mocks/")
  })

  test('P2-UI01/P2-UI02/P2-UI03/P2-UI04/P2-UI05: shared UI primitive usage and docs are aligned', async () => {
    const [selectIndex, dataTableIndex, statusPillIndex, pageHeaderIndex, skeletonIndex] =
      await Promise.all([
        readRepoFile('src/shared/ui/select/index.ts'),
        readRepoFile('src/shared/ui/data-table/index.ts'),
        readRepoFile('src/shared/ui/status-pill/index.ts'),
        readRepoFile('src/shared/ui/page-header/index.ts'),
        readRepoFile('src/shared/ui/skeleton/index.ts'),
      ])

    expect(selectIndex).toContain('Select')
    expect(dataTableIndex).toContain('DataTable')
    expect(statusPillIndex).toContain('StatusPill')
    expect(pageHeaderIndex).toContain('PageHeader')
    expect(skeletonIndex).toContain('Skeleton')

    const subordinateFilters = await readRepoFile(
      'src/features/people/components/subordinates-filters/SubordinatesFilters.tsx',
    )
    expect(subordinateFilters).toContain("from '@/shared/ui/input'")
    expect(subordinateFilters).toContain("from '@/shared/ui/select'")
    expect(subordinateFilters).not.toContain('<input')
    expect(subordinateFilters).not.toContain('<select')

    const sharedUiDoc = await readRepoFile('docs/architecture/shared-ui.md')
    expect(sharedUiDoc.toLowerCase()).toContain('select')
    expect(sharedUiDoc.toLowerCase()).toContain('data-table')
    expect(sharedUiDoc.toLowerCase()).toContain('status-pill')
    expect(sharedUiDoc.toLowerCase()).toContain('page-header')
    expect(sharedUiDoc.toLowerCase()).toContain('skeleton')
  })

  test('P2-H01/P2-H02/P2-H03/P2-H04: planning handoff documents are present and phase-aligned', async () => {
    const stateDoc = await readRepoFile('.planning/STATE.md')
    const phaseStatusDoc = await readRepoFile('.planning/phases/phase-2-dashboard/STATUS.md')
    const phaseValidationDoc = await readRepoFile(
      '.planning/phases/phase-2-dashboard/VALIDATION.md',
    )
    const phaseSrsDoc = await readRepoFile('.planning/phases/phase-2-dashboard/SRS.md')

    expect(stateDoc).toContain('Phase 2')
    expect(phaseStatusDoc).toContain('Phase 2')
    expect(phaseStatusDoc).toContain('dashboard')
    expect(phaseValidationDoc).toContain('Validation')
    expect(phaseSrsDoc).toContain('## 17. Deferred to Phase 3+')
  })
})
