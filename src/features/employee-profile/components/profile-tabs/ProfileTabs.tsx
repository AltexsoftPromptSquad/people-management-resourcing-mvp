import type { FC } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import type { ProfileTabsProps } from './ProfileTabs.types'

export const ProfileTabs: FC<ProfileTabsProps> = ({ tabs, defaultValue, value, onValueChange }) => {
  const initialValue = defaultValue ?? tabs[0]?.value ?? ''

  if (!initialValue) {
    return null
  }

  return (
    <Tabs defaultValue={initialValue} value={value} onValueChange={onValueChange}>
      <TabsList className="w-full justify-start overflow-x-auto">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
