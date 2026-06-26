import { createBrowserRouter } from 'react-router'
import { AppLayout } from './layouts/app-layout'
import { RoleLandingRedirect, RoleRoute } from './route-guards'
import {
  getCustomListsPagePath,
  getDashboardPagePath,
  getFallbackRoutePath,
  getHomePagePath,
  getMyProfilePagePath,
  getPersonProfilePagePath,
  getResourcingIncomingPagePath,
  getResourcingRequestsPagePath,
  getRisksPagePath,
  getSubordinatesPagePath,
} from './routes'
import { CustomListsPage } from '@/pages/custom-lists-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { MyProfilePage } from '@/pages/my-profile-page'
import { PersonProfilePage } from '@/pages/person-profile-page'
import { ResourcingIncomingPage } from '@/pages/resourcing-incoming-page'
import { ResourcingRequestsPage } from '@/pages/resourcing-requests-page'
import { RisksPage } from '@/pages/risks-page'
import { SubordinatesPage } from '@/pages/subordinates-page'

export const router = createBrowserRouter([
  {
    path: getHomePagePath(),
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <RoleLandingRedirect />,
      },
      {
        path: getDashboardPagePath(),
        element: (
          <RoleRoute allowedRole="unit-manager">
            <DashboardPage />
          </RoleRoute>
        ),
      },
      {
        path: getSubordinatesPagePath(),
        element: (
          <RoleRoute allowedRole="unit-manager">
            <SubordinatesPage />
          </RoleRoute>
        ),
      },
      {
        path: getPersonProfilePagePath(':personId'),
        element: (
          <RoleRoute allowedRole="unit-manager">
            <PersonProfilePage />
          </RoleRoute>
        ),
      },
      {
        path: getCustomListsPagePath(),
        element: (
          <RoleRoute allowedRole="unit-manager">
            <CustomListsPage />
          </RoleRoute>
        ),
      },
      {
        path: getResourcingIncomingPagePath(),
        element: (
          <RoleRoute allowedRole="unit-manager">
            <ResourcingIncomingPage />
          </RoleRoute>
        ),
      },
      {
        path: getRisksPagePath(),
        element: (
          <RoleRoute allowedRole="unit-manager">
            <RisksPage />
          </RoleRoute>
        ),
      },
      {
        path: getResourcingRequestsPagePath(),
        element: (
          <RoleRoute allowedRole="delivery-manager">
            <ResourcingRequestsPage />
          </RoleRoute>
        ),
      },
      {
        path: getMyProfilePagePath(),
        element: (
          <RoleRoute allowedRole="employee">
            <MyProfilePage />
          </RoleRoute>
        ),
      },
      {
        path: getFallbackRoutePath(),
        element: <RoleLandingRedirect />,
      },
    ],
  },
])
