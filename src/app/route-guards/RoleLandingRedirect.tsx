import type { FC } from 'react'
import { Navigate } from 'react-router'
import { getRoleLandingPagePath } from '../routes'
import { useRoleStore } from '@/store/role-store'

export const RoleLandingRedirect: FC = () => {
  const activeRole = useRoleStore((state) => state.activeRole)

  return <Navigate to={getRoleLandingPagePath(activeRole)} replace />
}
