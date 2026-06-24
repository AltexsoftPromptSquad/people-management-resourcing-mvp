import type { ReactNode } from 'react'
import type { Role } from '@/types'

export type RoleProtectedRouteProps = {
  allowedRoles: Role[]
  children: ReactNode
}
