import type { FC } from 'react'
import { Badge } from '@/shared/ui/badge'
import type { StatusPillProps } from './StatusPill.types'

export const StatusPill: FC<StatusPillProps> = ({ tone = 'neutral', children }) => {
  return <Badge tone={tone}>{children}</Badge>
}
