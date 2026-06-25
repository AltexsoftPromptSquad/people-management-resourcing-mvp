import { cva } from 'class-variance-authority'

export const shadcnBadgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-slate-800 text-white',
        secondary: 'border-transparent bg-slate-100 text-slate-700',
        destructive: 'border-transparent bg-red-700 text-white',
        outline: 'text-slate-950',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
