import {
  getDashboardPagePath,
  getMyProfilePagePath,
  getResourcingRequestsPagePath,
} from '@/app/routes'
import type { Role } from '@/types'

export const getRoleLandingPath = (role: Role) => {
  if (role === 'delivery-manager') {
    return getResourcingRequestsPagePath()
  }

  if (role === 'employee') {
    return getMyProfilePagePath()
  }

  return getDashboardPagePath()
}
