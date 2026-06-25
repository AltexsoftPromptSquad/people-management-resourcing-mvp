const viteEnableMocks = import.meta.env.VITE_ENABLE_MOCKS

export const isViteDev = import.meta.env.DEV
export const isViteEnableMocks = viteEnableMocks === 'true'

export const shouldEnableMocking = isViteDev || isViteEnableMocks
