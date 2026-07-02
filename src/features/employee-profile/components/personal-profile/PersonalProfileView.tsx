import type { FC } from 'react'
import { EmptyState } from '@/shared/ui/empty-state'
import { PageHeader } from '@/shared/ui/page-header'
import type { PersonalProfileViewProps } from './PersonalProfileView.types'

export const PersonalProfileView: FC<PersonalProfileViewProps> = ({
  person,
  actionItems,
  documents,
  idp,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Profile"
        description="Contact details, action items, IDP status, and employee-visible documents."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-lg font-semibold text-slate-950">Profile</h2>
        <p className="mt-2 text-sm text-slate-700">
          {person.firstName} {person.lastName} · {person.position} · {person.grade}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Personal email: {person.personalEmail} · Personal phone: {person.personalPhone}
        </p>
        <p className="mt-1 text-sm text-slate-600">IDP status: {idp?.status ?? 'Not Started'}</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-lg font-semibold text-slate-950">Action Items</h2>
        {actionItems.length === 0 ? (
          <EmptyState
            title="No action items available"
            description="When a manager assigns actions, they will appear in this section."
          />
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {actionItems.map((item) => (
              <li key={item.id}>
                {item.title} - {item.status}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-lg font-semibold text-slate-950">Documents</h2>
        {documents.length === 0 ? (
          <EmptyState
            title="No documents uploaded"
            description="Certificates and other employee-visible documents will be listed here."
          />
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {documents.map((document) => (
              <li key={document.id}>
                {document.name} - {document.type}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
