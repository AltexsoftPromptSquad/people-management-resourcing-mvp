import { BriefcaseBusiness, LayoutDashboard, UserRound, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  getDashboardPagePath,
  getMyProfilePagePath,
  getResourcingRequestsPagePath,
  getSubordinatesPagePath,
} from './routes'
import type { Role } from '@/types/role'

export type NavigationItem = {
  label: string
  to: string
  Icon: LucideIcon
}

export const navigationItemsByRole: Record<Role, NavigationItem[]> = {
  'unit-manager': [
    { label: 'Dashboard', to: getDashboardPagePath(), Icon: LayoutDashboard },
    { label: 'Subordinates', to: getSubordinatesPagePath(), Icon: Users },
  ],
  'delivery-manager': [
    { label: 'Resourcing Requests', to: getResourcingRequestsPagePath(), Icon: BriefcaseBusiness },
  ],
  employee: [{ label: 'My Profile', to: getMyProfilePagePath(), Icon: UserRound }],
}
