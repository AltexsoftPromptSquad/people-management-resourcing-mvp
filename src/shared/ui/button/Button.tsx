import { Slot } from '@radix-ui/react-slot'
import type { FC } from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from './Button.constants'
import type { ButtonProps } from './Button.types'

export const Button: FC<ButtonProps> = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) => {
  const Component = asChild ? Slot : 'button'

  return (
    <Component
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
