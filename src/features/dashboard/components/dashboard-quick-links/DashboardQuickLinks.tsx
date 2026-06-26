import type { FC } from 'react'
import { Link } from 'react-router'
import {
  getCustomListsPagePath,
  getResourcingIncomingPagePath,
  getRisksPagePath,
  getSubordinatesPagePath,
} from '@/app/routes'
import { Button } from '@/shared/ui/button'

const quickLinks = [
  { label: 'Subordinates', to: getSubordinatesPagePath() },
  { label: 'Custom Lists', to: getCustomListsPagePath() },
  { label: 'Resourcing', to: getResourcingIncomingPagePath() },
  { label: 'Risks', to: getRisksPagePath() },
] as const

export const DashboardQuickLinks: FC = () => {
  return (
    <section
      aria-label="Quick navigation"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
    >
      <h2 className="text-base font-semibold text-slate-950">Quick Navigation</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {quickLinks.map((link) => (
          <Button key={link.label} asChild variant="outline">
            <Link to={link.to}>{link.label}</Link>
          </Button>
        ))}
      </div>
    </section>
  )
}
