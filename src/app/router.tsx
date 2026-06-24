import { createBrowserRouter, Navigate } from 'react-router'
import { AppLayout } from './layouts/app-layout'
import { RoleLandingRedirect, RoleProtectedRoute } from './route-guards'
import {
  getDashboardPagePath,
  getFallbackRoutePath,
  getHomePagePath,
  getMyProfilePagePath,
  getResourcingRequestsPagePath,
} from './routes'
import { DashboardPage } from '@/pages/dashboard-page'
import { HomePage } from '@/pages/home-page'
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
          <RoleProtectedRoute allowedRoles={['unit-manager']}>
            <DashboardPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: getResourcingRequestsPagePath(),
        element: (
          <RoleProtectedRoute allowedRoles={['delivery-manager']}>
            <ResourcingRequestsPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: getMyProfilePagePath(),
        element: (
          <RoleProtectedRoute allowedRoles={['employee']}>
            <MyProfilePage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: getFallbackRoutePath(),
        element: <Navigate to={getHomePagePath()} replace />,
      },
    ],
  },
])
