import type { FC } from 'react'
import { Navigate } from 'react-router'
import { getRoleLandingPath } from '@/features/roles/utils/get-role-landing-path'
import { useRoleStore } from '@/store/role-store'

export const RoleLandingRedirect: FC = () => {
  const activeRole = useRoleStore((state) => state.activeRole)

  return <Navigate to={getRoleLandingPath(activeRole)} replace />
}
