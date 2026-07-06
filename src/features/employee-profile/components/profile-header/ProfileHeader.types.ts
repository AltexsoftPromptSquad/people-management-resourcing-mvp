import type { ReactNode } from 'react'
import type { Person } from '@/types/person'

export type ProfileHeaderProps = {
  person: Person
  managerName?: string
  unitName?: string
  headerActions?: ReactNode
}
