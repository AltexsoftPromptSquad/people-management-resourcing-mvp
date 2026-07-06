import type { FC } from 'react'
import { SHARED_PROFILE_SECTION_LABELS } from '../constants/sections'
import type { SharedProfileView } from '@/types/shared-profile-view'

export type SharedProfileSectionsProps = {
  profile: SharedProfileView
}

export const SharedProfileSections: FC<SharedProfileSectionsProps> = ({ profile }) => {
  return (
    <div className="space-y-6">
      {profile.allowedSections.includes('basic-info') ? (
        <section>
          <h2 className="text-lg font-semibold text-slate-950">
            {SHARED_PROFILE_SECTION_LABELS['basic-info']}
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            {profile.person.firstName} {profile.person.lastName}
          </p>
          <p className="text-sm text-slate-600">
            {profile.person.position} · {profile.person.grade}
          </p>
        </section>
      ) : null}

      {profile.allowedSections.includes('job-and-skills') && profile.skills ? (
        <section>
          <h2 className="text-lg font-semibold text-slate-950">
            {SHARED_PROFILE_SECTION_LABELS['job-and-skills']}
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {profile.skills.map((skill) => (
              <li key={`${skill.name}-${skill.level}`}>
                {skill.name} ({skill.level})
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {profile.allowedSections.includes('availability') ? (
        <section>
          <h2 className="text-lg font-semibold text-slate-950">
            {SHARED_PROFILE_SECTION_LABELS.availability}
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            Availability: {profile.person.availabilityPercent}% · Status:{' '}
            {profile.person.currentProjectStatus}
          </p>
        </section>
      ) : null}

      {profile.allowedSections.includes('project-history') && profile.projectHistory ? (
        <section>
          <h2 className="text-lg font-semibold text-slate-950">
            {SHARED_PROFILE_SECTION_LABELS['project-history']}
          </h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {profile.projectHistory.map((item) => (
              <li key={`${item.projectName}-${item.startDate}`} className="rounded-md border p-2">
                {item.projectName} — {item.role} ({item.allocationPercent}%)
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {profile.allowedSections.includes('feedbacks') && profile.feedbacks ? (
        <section>
          <h2 className="text-lg font-semibold text-slate-950">
            {SHARED_PROFILE_SECTION_LABELS.feedbacks}
          </h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {profile.feedbacks.map((feedback, index) => (
              <li key={`${feedback.type}-${index}`}>{feedback.content}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {profile.allowedSections.includes('scheduled-leaves') && profile.scheduledLeaves ? (
        <section>
          <h2 className="text-lg font-semibold text-slate-950">
            {SHARED_PROFILE_SECTION_LABELS['scheduled-leaves']}
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {profile.scheduledLeaves.map((leave) => (
              <li key={`${leave.startDate}-${leave.endDate}`}>
                {leave.leaveType}: {leave.startDate} to {leave.endDate}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {profile.allowedSections.includes('risks') && profile.risks ? (
        <section>
          <h2 className="text-lg font-semibold text-slate-950">
            {SHARED_PROFILE_SECTION_LABELS.risks}
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {profile.risks.map((risk, index) => (
              <li key={`${risk.level}-${index}`}>
                {risk.level}: {risk.description}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {profile.allowedSections.includes('documents') && profile.documents ? (
        <section>
          <h2 className="text-lg font-semibold text-slate-950">
            {SHARED_PROFILE_SECTION_LABELS.documents}
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {profile.documents.map((document) => (
              <li key={`${document.name}-${document.type}`}>
                {document.name} ({document.type})
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {profile.allowedSections.includes('custom-fields') && profile.customFields ? (
        <section>
          <h2 className="text-lg font-semibold text-slate-950">
            {SHARED_PROFILE_SECTION_LABELS['custom-fields']}
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {Object.entries(profile.customFields).map(([fieldName, fieldValue]) => (
              <li key={fieldName}>
                {fieldName}: {String(fieldValue ?? '—')}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
