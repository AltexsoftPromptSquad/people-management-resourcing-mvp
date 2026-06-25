import { createBrowserRouter } from 'react-router'
import { AppLayout } from './layouts/app-layout'
import { RoleLandingRedirect, RoleRoute } from './route-guards'
import {
  getDashboardPagePath,
  getFallbackRoutePath,
  getHomePagePath,
  getMyProfilePagePath,
  getResourcingRequestsPagePath,
} from './routes'
import { DashboardPage } from '@/pages/dashboard-page'
import { MyProfilePage } from '@/pages/my-profile-page'
import { ResourcingRequestsPage } from '@/pages/resourcing-requests-page'

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
