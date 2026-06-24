import { QueryClientProvider } from '@tanstack/react-query'
import type { FC } from 'react'
import { queryClient } from '@/lib/query/query-client'
import type { AppProvidersProps } from './AppProviders.types'

export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
