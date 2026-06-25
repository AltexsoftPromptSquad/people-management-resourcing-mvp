import type { ReactNode } from 'react'
import type { Role } from '@/types/role'

export type RoleRouteProps = {
  allowedRole: Role
  children: ReactNode
}
