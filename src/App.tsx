import type { FC } from 'react'
import { AppProviders } from './app/providers/AppProviders'
import { AppRouterProvider } from './app/router-provider'

const App: FC = () => {
  return (
    <AppProviders>
      <AppRouterProvider />
    </AppProviders>
  )
}

export default App
