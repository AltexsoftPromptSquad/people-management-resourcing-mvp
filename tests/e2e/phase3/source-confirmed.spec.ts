import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { expect, test } from '../support/test'

const readRepoFile = async (relativePath: string) => {
  const absolutePath = path.join(process.cwd(), relativePath)
  return readFile(absolutePath, 'utf8')
}

test.describe('Phase 3 - source-confirmed checks', () => {
  test('P3-SC01/P3-SC02: query keys and mutation invalidation are wired', async () => {
    const [queryKeys, hooks] = await Promise.all([
      readRepoFile('src/lib/query/query-keys.ts'),
      readRepoFile('src/features/employee-profile/hooks/use-employee-profile-hooks.ts'),
    ])

    expect(queryKeys).toContain('documents: (personId: string)')
    expect(queryKeys).toContain('idp: (personId: string)')
    expect(hooks).toContain('invalidateQueries({ queryKey: queryKeys.person(personId) })')
    expect(hooks).toContain('invalidateQueries({ queryKey: queryKeys.feedbacks(personId) })')
    expect(hooks).toContain('invalidateQueries({ queryKey: queryKeys.documents(personId) })')
    expect(hooks).toContain('invalidateQueries({ queryKey: queryKeys.idp(personId) })')
  })

  test('P3-SC03/P3-SC05: employee-profile feature module and shared primitives exist', async () => {
    const [
      featureIndex,
      employeeProfilePage,
      myProfilePage,
      tabsPrimitive,
      sheetPrimitive,
      textareaPrimitive,
      toastPrimitive,
    ] = await Promise.all([
      readRepoFile('src/features/employee-profile/index.ts'),
      readRepoFile('src/pages/employee-profile-page/EmployeeProfilePage.tsx'),
      readRepoFile('src/pages/my-profile-page/MyProfilePage.tsx'),
      readRepoFile('src/shared/ui/tabs/index.ts'),
      readRepoFile('src/shared/ui/sheet/index.ts'),
      readRepoFile('src/shared/ui/textarea/index.ts'),
      readRepoFile('src/shared/ui/toast/index.ts'),
    ])

    expect(featureIndex).toContain("export * from './api'")
    expect(featureIndex).toContain("export * from './hooks'")
    expect(featureIndex).toContain("export * from './components'")
    expect(employeeProfilePage).toContain("from '@/features/employee-profile'")
    expect(myProfilePage).toContain("from '@/features/employee-profile'")
    expect(tabsPrimitive).toContain('Tabs')
    expect(sheetPrimitive).toContain('Sheet')
    expect(textareaPrimitive).toContain('Textarea')
    expect(toastPrimitive).toContain('ToastProvider')
  })

  test('P3-SC04: route pages stay thin composition layers; routing stays centralized', async () => {
    const [employeeProfilePage, myProfilePage, routes, router] = await Promise.all([
      readRepoFile('src/pages/employee-profile-page/EmployeeProfilePage.tsx'),
      readRepoFile('src/pages/my-profile-page/MyProfilePage.tsx'),
      readRepoFile('src/app/routes.ts'),
      readRepoFile('src/app/router.tsx'),
    ])

    for (const pageSource of [employeeProfilePage, myProfilePage]) {
      expect(pageSource).not.toContain("from '@tanstack/react-query'")
      expect(pageSource).not.toContain("from '@/lib/api/api-client'")
      expect(pageSource).not.toMatch(/\bapiGet\(|\bapiPost\(|\bapiPatch\(/)
    }

    expect(routes).toContain('getEmployeeProfilePagePath')
    expect(routes).toContain('getMyProfilePagePath')
    expect(router).toContain('allowedRole="unit-manager"')
    expect(router).toContain('<EmployeeProfilePage />')
    expect(router).toContain('allowedRole="employee"')
    expect(router).toContain('<MyProfilePage />')
  })
})
