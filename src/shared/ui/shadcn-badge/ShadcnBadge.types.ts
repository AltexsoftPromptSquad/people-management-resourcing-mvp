import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes, ReactNode } from 'react'
import type { shadcnBadgeVariants } from './ShadcnBadge.constants'

export type ShadcnBadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof shadcnBadgeVariants> & {
    children: ReactNode
  }
