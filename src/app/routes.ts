import type { Role } from '@/types/role'

export const getHomePagePath = () => '/'

export const getDashboardPagePath = () => '/dashboard'

export const getResourcingRequestsPagePath = () => '/resourcing/requests'

export const getMyProfilePagePath = () => '/my-profile'

export const getSubordinatesPagePath = () => '/subordinates'

export const getEmployeeProfilePagePath = (personId: string) => `/people/${personId}`

export const getCustomListsPagePath = () => '/custom-lists'

export const getResourcingIncomingPagePath = () => '/resourcing/incoming'

export const getResourcingAssignmentsPagePath = () => '/resourcing/assignments'

export const getRisksPagePath = () => '/risks'

export const getSharedProfilePagePath = (token: string) => `/shared/${token}`

export const getFallbackRoutePath = () => '*'

export const getRoleLandingPagePath = (role: Role) => {
  const landingPagePathByRole: Record<Role, string> = {
    'unit-manager': getDashboardPagePath(),
    'delivery-manager': getResourcingRequestsPagePath(),
    employee: getMyProfilePagePath(),
  }

  return landingPagePathByRole[role]
}
