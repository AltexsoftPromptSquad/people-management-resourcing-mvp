import { BriefcaseBusiness, LayoutDashboard, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getDashboardPagePath, getMyProfilePagePath, getResourcingRequestsPagePath } from './routes'
import type { Role } from '@/types/role'

export type NavigationItem = {
  label: string
  to: string
  Icon: LucideIcon
}

export const navigationItemsByRole: Record<Role, NavigationItem[]> = {
  'unit-manager': [{ label: 'Dashboard', to: getDashboardPagePath(), Icon: LayoutDashboard }],
  'delivery-manager': [
    { label: 'Resourcing Requests', to: getResourcingRequestsPagePath(), Icon: BriefcaseBusiness },
  ],
  employee: [{ label: 'My Profile', to: getMyProfilePagePath(), Icon: UserRound }],
}
