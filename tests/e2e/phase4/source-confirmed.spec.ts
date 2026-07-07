import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { expect, test } from '../support/test'

const readRepoFile = async (relativePath: string) => {
  const absolutePath = path.join(process.cwd(), relativePath)
  return readFile(absolutePath, 'utf8')
}

test.describe('Phase 4 - source-confirmed architecture checks', () => {
  test('P4-SC01: resourcing feature module contains all request/proposal/decision/warning logic', async () => {
    const [resourcingWorkspace, incomingWorkspace, requestsPage, incomingPage] = await Promise.all([
      readRepoFile('src/features/resourcing/components/ResourcingRequestsWorkspace.tsx'),
      readRepoFile('src/features/resourcing/components/ResourcingIncomingWorkspace.tsx'),
      readRepoFile('src/pages/resourcing-requests-page/ResourcingRequestsPage.tsx'),
      readRepoFile('src/pages/resourcing-incoming-page/ResourcingIncomingPage.tsx'),
    ])

    // Feature module contains business logic
    expect(resourcingWorkspace).toContain('useResourcingRequestsQuery')
    expect(resourcingWorkspace).toContain('useCandidateProposalsQuery')
    expect(incomingWorkspace).toContain('getCandidateWarnings')
    expect(incomingWorkspace).toContain('useSubmitCandidateProposalsMutation')

    // Pages are thin composition layers — no direct API calls or query logic
    expect(requestsPage).not.toContain("from '@tanstack/react-query'")
    expect(requestsPage).not.toContain("from '@/lib/api/api-client'")
    expect(incomingPage).not.toContain("from '@tanstack/react-query'")
    expect(incomingPage).not.toContain("from '@/lib/api/api-client'")
  })

  test('P4-SC02: profile-sharing feature module contains generation and public view logic', async () => {
    const [generateSheet, sharedProfilePage, sharedProfileSections] = await Promise.all([
      readRepoFile('src/features/profile-sharing/components/GenerateSharedProfileSheet.tsx'),
      readRepoFile('src/pages/shared-profile-page/SharedProfilePage.tsx'),
      readRepoFile('src/features/profile-sharing/components/SharedProfileSections.tsx'),
    ])

    expect(generateSheet).toContain('useCreateSharedProfileMutation')
    expect(sharedProfilePage).toContain("from '@/features/profile-sharing")
    expect(sharedProfileSections).toBeTruthy()

    // Shared profile page is thin
    expect(sharedProfilePage).not.toContain("from '@tanstack/react-query'")
    expect(sharedProfilePage).not.toContain("from '@/lib/api/api-client'")
  })

  test('P4-SC03: candidate warning logic lives in candidate-warnings.ts — not inline in components', async () => {
    const [warningsUtil, incomingWorkspace, candidateRow] = await Promise.all([
      readRepoFile('src/features/resourcing/utils/candidate-warnings.ts'),
      readRepoFile('src/features/resourcing/components/ResourcingIncomingWorkspace.tsx'),
      readRepoFile('src/features/resourcing/components/CandidateRow.tsx'),
    ])

    // The utility file must exist and contain the warning logic
    expect(warningsUtil).toContain('getCandidateWarnings')
    expect(warningsUtil).toContain('projectedAllocation')
    expect(warningsUtil).toContain('leave-overlap')
    expect(warningsUtil).toContain('risk')

    // Workspace imports and calls the utility — does not re-implement inline
    expect(incomingWorkspace).toContain("from '../utils/candidate-warnings'")
    expect(incomingWorkspace).toContain('getCandidateWarnings(')

    // CandidateRow renders warnings but does not compute them
    expect(candidateRow).not.toContain('projectedAllocation')
    expect(candidateRow).not.toContain('leave-overlap')
  })

  test('P4-SC04: route pages are thin composition layers with no business logic', async () => {
    const [requestsPage, incomingPage, sharedProfilePage] = await Promise.all([
      readRepoFile('src/pages/resourcing-requests-page/ResourcingRequestsPage.tsx'),
      readRepoFile('src/pages/resourcing-incoming-page/ResourcingIncomingPage.tsx'),
      readRepoFile('src/pages/shared-profile-page/SharedProfilePage.tsx'),
    ])

    const disallowedPatterns = [
      /\bapiGet\(/,
      /\bapiPost\(/,
      /\bapiPatch\(/,
      /useQuery\(/,
      /useMutation\(/,
    ]

    for (const pageSource of [requestsPage, incomingPage]) {
      for (const pattern of disallowedPatterns) {
        expect(pageSource).not.toMatch(pattern)
      }
    }

    // SharedProfilePage is allowed to call a hook — but not raw api calls
    expect(sharedProfilePage).not.toMatch(/\bapiGet\(/)
    expect(sharedProfilePage).not.toMatch(/\bapiPost\(/)
  })

  test('P4-SC05: query-keys.ts exports resourcingRequest, candidateProposals, and sharedProfile helpers', async () => {
    const queryKeys = await readRepoFile('src/lib/query/query-keys.ts')

    expect(queryKeys).toContain('resourcingRequest: (id: string)')
    expect(queryKeys).toContain('candidateProposals: (requestId: string)')
    expect(queryKeys).toContain('sharedProfile: (token: string)')
  })

  test('P4-SC06: import direction — pages import features; features do not import from pages or other feature internals', async () => {
    const [requestsPage, incomingPage, resourcingWorkspace, incomingWorkspace] = await Promise.all([
      readRepoFile('src/pages/resourcing-requests-page/ResourcingRequestsPage.tsx'),
      readRepoFile('src/pages/resourcing-incoming-page/ResourcingIncomingPage.tsx'),
      readRepoFile('src/features/resourcing/components/ResourcingRequestsWorkspace.tsx'),
      readRepoFile('src/features/resourcing/components/ResourcingIncomingWorkspace.tsx'),
    ])

    // Pages import from features
    expect(requestsPage).toContain("from '@/features/resourcing")
    expect(incomingPage).toContain("from '@/features/resourcing")

    // Feature internals must not import from pages
    expect(resourcingWorkspace).not.toMatch(/from ['"]\.\.\/\.\.\/\.\.\/pages/)
    expect(incomingWorkspace).not.toMatch(/from ['"]\.\.\/\.\.\/\.\.\/pages/)

    // Feature internals must not import from other feature internals (cross-feature boundary)
    expect(resourcingWorkspace).not.toMatch(/from ['"]@\/features\/employee-profile\/components/)
    expect(incomingWorkspace).not.toMatch(/from ['"]@\/features\/employee-profile\/components/)
  })

  test('P4-SC07: server-like data is managed by TanStack Query; active role/persona in Zustand only', async () => {
    const [resourcingHooks, incomingWorkspace, rolesStore] = await Promise.all([
      readRepoFile('src/features/resourcing/hooks/use-resourcing-hooks.ts'),
      readRepoFile('src/features/resourcing/components/ResourcingIncomingWorkspace.tsx'),
      readRepoFile('src/store/role-store.ts'),
    ])

    // Server data uses TanStack Query
    expect(resourcingHooks).toContain('useQuery')

    // Incoming workspace does not store requests/proposals in useState or Zustand
    expect(incomingWorkspace).not.toContain('useResourcingStore')
    expect(incomingWorkspace).not.toContain('useRequestsStore')

    // Roles store manages active persona — not request data
    expect(rolesStore).toContain('activeRole')
    expect(rolesStore).not.toContain('resourcingRequests')
    expect(rolesStore).not.toContain('candidateProposals')
  })

  test('P4-SC08: shared-ui.md component inventory lists checkbox, dialog/confirm-dialog, and warning-badge as Available', async () => {
    const sharedUiDocs = await readRepoFile('docs/architecture/shared-ui.md')

    expect(sharedUiDocs).toMatch(/checkbox/i)
    expect(sharedUiDocs).toMatch(/confirm-dialog|ConfirmDialog/i)
    expect(sharedUiDocs).toMatch(/warning-badge|WarningBadge/i)
  })
})
