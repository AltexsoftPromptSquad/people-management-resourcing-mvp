import { createBrowserRouter } from 'react-router'
import { AppLayout } from './layouts/app-layout'
import { RoleLandingRedirect, RoleRoute } from './route-guards'
import {
  getCustomListsPagePath,
  getDashboardPagePath,
  getFallbackRoutePath,
  getHomePagePath,
  getMyProfilePagePath,
  getEmployeeProfilePagePath,
  getResourcingIncomingPagePath,
  getResourcingRequestsPagePath,
  getRisksPagePath,
  getSharedProfilePagePath,
  getSubordinatesPagePath,
} from './routes'
import { CustomListsPage } from '@/pages/custom-lists-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { EmployeeProfilePage } from '@/pages/employee-profile-page'
import { MyProfilePage } from '@/pages/my-profile-page'
import { ResourcingIncomingPage } from '@/pages/resourcing-incoming-page'
import { ResourcingRequestsPage } from '@/pages/resourcing-requests-page'
import { SharedProfilePage } from '@/pages/shared-profile-page'
import { RisksPage } from '@/pages/risks-page'
import { SubordinatesPage } from '@/pages/subordinates-page'

export const router = createBrowserRouter([
  {
    path: getSharedProfilePagePath(':token'),
    element: <SharedProfilePage />,
  },
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
        path: getEmployeeProfilePagePath(':personId'),
        element: (
          <RoleRoute allowedRole="unit-manager">
            <EmployeeProfilePage />
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
