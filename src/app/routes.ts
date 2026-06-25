import type { Role } from '@/types/role'

export const getHomePagePath = () => '/'

export const getDashboardPagePath = () => '/dashboard'

export const getResourcingRequestsPagePath = () => '/resourcing/requests'

export const getMyProfilePagePath = () => '/my-profile'

export const getFallbackRoutePath = () => '*'

export const getRoleLandingPagePath = (role: Role) => {
  const landingPagePathByRole: Record<Role, string> = {
    'unit-manager': getDashboardPagePath(),
    'delivery-manager': getResourcingRequestsPagePath(),
    employee: getMyProfilePagePath(),
  }

  return landingPagePathByRole[role]
}
