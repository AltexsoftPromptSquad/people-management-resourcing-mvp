import type { FC } from 'react'
import { Navigate } from 'react-router'
import { getRoleLandingPagePath } from '../routes'
import { useRoleStore } from '@/store/role-store'
import type { RoleRouteProps } from './RoleRoute.types'

export const RoleRoute: FC<RoleRouteProps> = ({ allowedRole, children }) => {
  const activeRole = useRoleStore((state) => state.activeRole)

  if (activeRole !== allowedRole) {
    return <Navigate to={getRoleLandingPagePath(activeRole)} replace />
  }

  return children
}
