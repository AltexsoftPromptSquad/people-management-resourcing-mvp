import type { FC } from 'react'
import type { PageHeaderProps } from './PageHeader.types'

export const PageHeader: FC<PageHeaderProps> = ({ eyebrow, title, description, actions }) => {
  return (
    <header>
      {eyebrow ? <p className="text-sm font-medium text-sky-700">{eyebrow}</p> : null}
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <h1 tabIndex={-1} className="text-3xl font-semibold text-slate-950">
          {title}
        </h1>
        {actions}
      </div>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
      ) : null}
    </header>
  )
}
