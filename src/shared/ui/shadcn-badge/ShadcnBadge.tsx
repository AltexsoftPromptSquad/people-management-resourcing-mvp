import type { FC } from 'react'
import { cn } from '../../../lib/utils'
import { shadcnBadgeVariants } from './ShadcnBadge.constants'
import type { ShadcnBadgeProps } from './ShadcnBadge.types'

export const ShadcnBadge: FC<ShadcnBadgeProps> = ({ className, variant, children, ...props }) => {
  return (
    <span className={cn(shadcnBadgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  )
}
