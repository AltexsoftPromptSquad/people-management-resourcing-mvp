import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:border-slate-700 focus-visible:ring-[3px] focus-visible:ring-slate-700/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-700 aria-invalid:ring-red-700/20 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: 'bg-slate-800 text-white shadow-xs hover:bg-slate-900',
        destructive:
          'bg-red-700 text-white shadow-xs hover:bg-red-800 focus-visible:ring-red-700/20',
        outline:
          'border border-slate-200 bg-white shadow-xs hover:bg-slate-100 hover:text-slate-800',
        secondary: 'bg-slate-100 text-slate-800 shadow-xs hover:bg-slate-200',
        ghost: 'hover:bg-slate-100 hover:text-slate-800',
        link: 'text-slate-800 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
