import type { FC } from 'react'
import { cn } from '@/lib/utils'
import type { SkeletonProps } from './Skeleton.types'

export const Skeleton: FC<SkeletonProps> = ({ className, ...props }) => {
  return <div className={cn('animate-pulse rounded-md bg-slate-200', className)} {...props} />
}
