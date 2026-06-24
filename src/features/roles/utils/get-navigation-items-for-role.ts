import {
  getDashboardPagePath,
  getMyProfilePagePath,
  getResourcingRequestsPagePath,
} from '@/app/routes'
import type { Role } from '@/types'

export type RoleNavigationItem = {
  label: string
  to: string
}

export const getNavigationItemsForRole = (role: Role): RoleNavigationItem[] => {
  if (role === 'delivery-manager') {
    return [{ label: 'My Requests', to: getResourcingRequestsPagePath() }]
  }

  if (role === 'employee') {
    return [{ label: 'My Profile', to: getMyProfilePagePath() }]
  }

  return [{ label: 'Dashboard', to: getDashboardPagePath() }]
}
