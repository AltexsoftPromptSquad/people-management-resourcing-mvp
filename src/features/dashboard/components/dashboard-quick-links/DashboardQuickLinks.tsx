import type { FC } from 'react'
import { BriefcaseBusiness, ListTodo, ShieldAlert, Users } from 'lucide-react'
import { Link } from 'react-router'
import {
  getCustomListsPagePath,
  getResourcingIncomingPagePath,
  getRisksPagePath,
  getSubordinatesPagePath,
} from '@/app/routes'

const quickLinks = [
  {
    label: 'Subordinates',
    description: 'View direct reports and staffing status.',
    to: getSubordinatesPagePath(),
    Icon: Users,
  },
  {
    label: 'Custom Lists',
    description: 'Access saved list placeholders for future phases.',
    to: getCustomListsPagePath(),
    Icon: ListTodo,
  },
  {
    label: 'Resourcing',
    description: 'Open incoming requests placeholder route.',
    to: getResourcingIncomingPagePath(),
    Icon: BriefcaseBusiness,
  },
  {
    label: 'Risks',
    description: 'Open operational risks placeholder route.',
    to: getRisksPagePath(),
    Icon: ShieldAlert,
  },
] as const

export const DashboardQuickLinks: FC = () => {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5" aria-label="Quick links">
      <h2 className="text-lg font-semibold text-slate-950">Quick Links</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {quickLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-md border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2"
          >
            <div className="flex items-start gap-3">
              <item.Icon className="mt-0.5 size-4 text-sky-700" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
