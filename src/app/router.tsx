import { createBrowserRouter, Navigate } from 'react-router'
import { AppLayout } from './layouts/app-layout'
import { getFallbackRoutePath, getHomePagePath } from './routes'
import { HomePage } from '@/pages/home-page'

export const router = createBrowserRouter([
  {
    path: getHomePagePath(),
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: getFallbackRoutePath(),
        element: <Navigate to={getHomePagePath()} replace />,
      },
    ],
  },
])
