import type { ReactNode } from 'react'
import type { SelectHTMLAttributes } from 'react'

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  children?: ReactNode
}
