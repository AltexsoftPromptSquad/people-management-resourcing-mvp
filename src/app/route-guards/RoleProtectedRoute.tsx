import type { FC } from 'react'
import { Navigate } from 'react-router'
import { getRoleLandingPath } from '@/features/roles/utils/get-role-landing-path'
import { useRoleStore } from '@/store/role-store'
import type { RoleProtectedRouteProps } from './RoleProtectedRoute.types'

export const RoleProtectedRoute: FC<RoleProtectedRouteProps> = ({ allowedRoles, children }) => {
  const activeRole = useRoleStore((state) => state.activeRole)

  if (!allowedRoles.includes(activeRole)) {
    return <Navigate to={getRoleLandingPath(activeRole)} replace />
  }

  return children
}
