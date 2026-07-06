import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import {
  EditableSection,
  ProfileHeader,
  ProfileTabs,
  useAddFeedbackMutation,
  useEmployeeProfileActionItemsQuery,
  useEmployeeProfileAssignmentHistoryQuery,
  useEmployeeProfileDocumentsQuery,
  useEmployeeProfileFeedbacksQuery,
  useEmployeeProfileIdpQuery,
  useEmployeeProfilePersonQuery,
  useEmployeeProfileProjectHistoryQuery,
  useEmployeeProfileRisksQuery,
  useEmployeeProfileScheduledLeavesQuery,
  useEmployeeProfileSkillsQuery,
  useUnitsQuery,
  useUpdateIdpMutation,
  useUpdatePersonMutation,
} from '@/features/employee-profile'
import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { Input } from '@/shared/ui/input'
import { LoadingState } from '@/shared/ui/loading-state'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet'
import { Select } from '@/shared/ui/select'
import { StatusPill } from '@/shared/ui/status-pill'
import { Textarea } from '@/shared/ui/textarea'
import { toast } from '@/shared/ui/toast'
import type { Person } from '@/types/person'
import type { Skill } from '@/types/skill'
import type { EmployeeProfilePageProps } from './EmployeeProfilePage.types'

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const formatPhone = (phone: string) => phone.replace(/\s*x\d+$/i, '').trim()

const formatCustomFieldLabel = (fieldKey: string) =>
  fieldKey
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

const getLeaveTone = (status: string) => (status === 'Confirmed' ? 'success' : 'warning')
const getIdpTone = (status: string) =>
  status === 'Completed' ? 'success' : status === 'In Progress' ? 'info' : 'neutral'
const getRiskTone = (riskLevel: string) =>
  riskLevel === 'High' || riskLevel === 'Critical'
    ? 'danger'
    : riskLevel === 'Medium'
      ? 'warning'
      : riskLevel === 'Low'
        ? 'success'
        : 'neutral'

export const EmployeeProfilePage: FC<EmployeeProfilePageProps> = () => {
  const navigate = useNavigate()
  const { personId } = useParams()
  const { activePersona } = useActivePersona()
  const [activeTab, setActiveTab] = useState('overview')
  const [isFeedbackSheetOpen, setFeedbackSheetOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState('')
  const [feedbackContent, setFeedbackContent] = useState('')
  const [feedbackError, setFeedbackError] = useState<{ type?: string; content?: string }>({})
  const [isEditingEnglish, setEditingEnglish] = useState(false)
  const [englishLevelDraft, setEnglishLevelDraft] = useState<Person['englishLevel']>('B2')
  const [isEditingSkills, setEditingSkills] = useState(false)
  const [skillLevelDrafts, setSkillLevelDrafts] = useState<Record<string, string>>({})
  const [isEditingNotes, setEditingNotes] = useState(false)
  const [managementNotesDraft, setManagementNotesDraft] = useState('')
  const [isEditingIdpReference, setEditingIdpReference] = useState(false)
  const [idpReferenceDraft, setIdpReferenceDraft] = useState('')
  const [editingCustomFieldKey, setEditingCustomFieldKey] = useState<string | null>(null)
  const [customFieldDraft, setCustomFieldDraft] = useState('')

  const personQuery = useEmployeeProfilePersonQuery(personId)
  const managerQuery = useEmployeeProfilePersonQuery(personQuery.data?.managerId)
  const unitsQuery = useUnitsQuery()
  const feedbacksQuery = useEmployeeProfileFeedbacksQuery(
    activeTab === 'feedbacks' ? personId : undefined,
  )
  const leavesQuery = useEmployeeProfileScheduledLeavesQuery(
    activeTab === 'overview' ? personId : undefined,
  )
  const risksQuery = useEmployeeProfileRisksQuery(
    activeTab === 'overview' || activeTab === 'risks' ? personId : undefined,
  )
  const actionItemsQuery = useEmployeeProfileActionItemsQuery(
    activeTab === 'overview' || activeTab === 'risks' ? personId : undefined,
  )
  const projectHistoryQuery = useEmployeeProfileProjectHistoryQuery(
    activeTab === 'project-history' ? personId : undefined,
  )
  const assignmentHistoryQuery = useEmployeeProfileAssignmentHistoryQuery(
    activeTab === 'resourcing-history' ? personId : undefined,
  )
  const documentsQuery = useEmployeeProfileDocumentsQuery(
    activeTab === 'documents-idp' ? personId : undefined,
  )
  const idpQuery = useEmployeeProfileIdpQuery(activeTab === 'documents-idp' ? personId : undefined)
  const skillsQuery = useEmployeeProfileSkillsQuery(
    activeTab === 'job-skills' ? personId : undefined,
  )

  const updatePersonMutation = useUpdatePersonMutation(personId ?? '')
  const addFeedbackMutation = useAddFeedbackMutation(personId ?? '')
  const updateIdpMutation = useUpdateIdpMutation(personId ?? '')
  const idp = idpQuery.data ?? null

  const feedbackList = useMemo(() => {
    const data = feedbacksQuery.data ?? []

    return [...data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [feedbacksQuery.data])

  useEffect(() => {
    if (!personQuery.data || isEditingEnglish) {
      return
    }

    setEnglishLevelDraft(personQuery.data.englishLevel)
  }, [isEditingEnglish, personQuery.data])

  useEffect(() => {
    if (!personQuery.data || isEditingNotes) {
      return
    }

    setManagementNotesDraft(personQuery.data.managementNotes ?? '')
  }, [isEditingNotes, personQuery.data])

  useEffect(() => {
    if (!isEditingSkills && skillsQuery.data) {
      setSkillLevelDrafts(
        Object.fromEntries(skillsQuery.data.map((skill) => [skill.id, skill.level as string])),
      )
    }
  }, [isEditingSkills, skillsQuery.data])

  useEffect(() => {
    if (!isEditingIdpReference) {
      setIdpReferenceDraft(idp?.documentReference ?? '')
    }
  }, [idp?.documentReference, isEditingIdpReference])

  if (personQuery.isPending) {
    return <LoadingState label="Loading profile…" className="mx-auto mt-10 max-w-7xl" />
  }

  if (personQuery.isError || !personQuery.data) {
    const isNotFound =
      personQuery.error instanceof Error &&
      personQuery.error.message.includes('Request failed: 404')

    return (
      <main className="px-6 py-10">
        <section className="mx-auto flex max-w-7xl flex-col gap-4">
          <ErrorState
            title={isNotFound ? 'Profile not found.' : 'Could not load profile'}
            description={
              isNotFound
                ? 'Refresh the page or return to the list.'
                : 'Refresh the page or return to the list.'
            }
          />
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Back to Subordinates
          </Button>
        </section>
      </main>
    )
  }

  const person = personQuery.data

  const handleFeedbackSubmit = async () => {
    const nextErrors: { type?: string; content?: string } = {}

    if (!feedbackType) {
      nextErrors.type = 'Type is required.'
    }

    if (feedbackContent.trim().length < 10) {
      nextErrors.content = 'Feedback must be at least 10 characters.'
    }

    setFeedbackError(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    try {
      await addFeedbackMutation.mutateAsync({
        authorId: activePersona?.personId ?? person.id,
        type: feedbackType as 'HR Note' | 'Performance' | 'General',
        content: feedbackContent.trim(),
        visibility: 'Manager Only',
      })
      toast.success('Feedback saved.')
      setFeedbackSheetOpen(false)
      setFeedbackType('')
      setFeedbackContent('')
      setFeedbackError({})
    } catch {
      toast.error('Failed to save feedback. Try again.')
    }
  }

  const handleCustomFieldSave = async (fieldKey: string) => {
    try {
      await updatePersonMutation.mutateAsync({
        customFieldValues: {
          [fieldKey]: customFieldDraft,
        },
      })
      setEditingCustomFieldKey(null)
    } catch {
      toast.error(`Could not save "${fieldKey}". Change was not applied.`)
    }
  }

  return (
    <main className="px-6 py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="outline" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Sheet open={isFeedbackSheetOpen} onOpenChange={setFeedbackSheetOpen}>
            <SheetTrigger asChild>
              <Button type="button">Add Feedback</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Add Feedback</SheetTitle>
                <SheetDescription>Add a private feedback entry for this employee.</SheetDescription>
              </SheetHeader>
              <div className="mt-5 space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Type *
                  <Select
                    className="mt-1"
                    value={feedbackType}
                    onChange={(event) => {
                      setFeedbackType(event.target.value)
                      setFeedbackError((previous) => ({ ...previous, type: undefined }))
                    }}
                  >
                    <option value="">Select type</option>
                    <option value="HR Note">HR Note</option>
                    <option value="Performance">Performance</option>
                    <option value="General">General</option>
                  </Select>
                  {feedbackError.type ? (
                    <p role="alert" aria-live="assertive" className="mt-1 text-sm text-red-700">
                      {feedbackError.type}
                    </p>
                  ) : null}
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Content *
                  <Textarea
                    className="mt-1"
                    value={feedbackContent}
                    placeholder="Write your feedback…"
                    onChange={(event) => {
                      setFeedbackContent(event.target.value)
                      setFeedbackError((previous) => ({ ...previous, content: undefined }))
                    }}
                  />
                  {feedbackError.content ? (
                    <p role="alert" aria-live="assertive" className="mt-1 text-sm text-red-700">
                      {feedbackError.content}
                    </p>
                  ) : null}
                </label>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </SheetClose>
                <Button
                  type="button"
                  onClick={() => void handleFeedbackSubmit()}
                  disabled={addFeedbackMutation.isPending}
                  aria-busy={addFeedbackMutation.isPending}
                >
                  Save Feedback
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <ProfileHeader
          person={person}
          managerName={
            managerQuery.data
              ? `${managerQuery.data.firstName} ${managerQuery.data.lastName}`
              : undefined
          }
          unitName={unitsQuery.data?.find((unit) => unit.id === person.unitId)?.name}
        />

        <ProfileTabs
          value={activeTab}
          onValueChange={setActiveTab}
          tabs={[
            {
              value: 'overview',
              label: 'Overview',
              content: (
                <div className="space-y-4">
                  <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                    <h2 className="text-lg font-semibold text-slate-950">Basic Information</h2>
                    <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                      <p>Personal email: {person.personalEmail}</p>
                      <p>Personal phone: {formatPhone(person.personalPhone)}</p>
                      <p>
                        Address: {person.address.addressLine}, {person.address.city},{' '}
                        {person.address.country}
                      </p>
                      <p>Employment type: {person.employmentType}</p>
                      <p>English level: {person.englishLevel}</p>
                      <p>Current status: {person.currentProjectStatus}</p>
                      <p>Risk count: {risksQuery.data?.length ?? 0}</p>
                      <p>
                        Open action items:{' '}
                        {actionItemsQuery.data?.filter((item) => item.status !== 'Done').length ??
                          0}
                      </p>
                    </div>
                  </section>
                  <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                    <h2 className="text-lg font-semibold text-slate-950">Scheduled Leaves</h2>
                    {leavesQuery.isPending ? (
                      <LoadingState label="Loading scheduled leaves…" className="mt-3" />
                    ) : leavesQuery.isError ? (
                      <ErrorState
                        className="mt-3"
                        title="Could not load Scheduled Leaves"
                        description="Refresh the page to try again."
                      />
                    ) : !leavesQuery.data || leavesQuery.data.length === 0 ? (
                      <EmptyState
                        className="mt-3"
                        title="No scheduled leaves"
                        description="Scheduled leave records will appear here."
                      />
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {leavesQuery.data.map((leave) => (
                          <li
                            key={leave.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 p-3 text-sm text-slate-700"
                          >
                            <span>
                              {leave.leaveType}: {formatDate(leave.startDate)} -{' '}
                              {formatDate(leave.endDate)}
                            </span>
                            <StatusPill tone={getLeaveTone(leave.status)}>
                              {leave.status}
                            </StatusPill>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                  <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                    <h2 className="text-lg font-semibold text-slate-950">Custom Fields</h2>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {Object.entries(person.customFieldValues).map(([fieldKey, value]) => (
                        <li key={fieldKey} className="rounded-md border border-slate-200 p-2">
                          <div className="flex items-center justify-between gap-2">
                            <strong className="font-medium">
                              {formatCustomFieldLabel(fieldKey)}
                            </strong>
                            {editingCustomFieldKey === fieldKey ? (
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => void handleCustomFieldSave(fieldKey)}
                                disabled={updatePersonMutation.isPending}
                              >
                                Save
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingCustomFieldKey(fieldKey)
                                  setCustomFieldDraft(String(value ?? ''))
                                }}
                              >
                                Edit
                              </Button>
                            )}
                          </div>
                          {editingCustomFieldKey === fieldKey ? (
                            <Input
                              className="mt-2"
                              autoFocus
                              value={customFieldDraft}
                              onChange={(event) => setCustomFieldDraft(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                  void handleCustomFieldSave(fieldKey)
                                }

                                if (event.key === 'Escape') {
                                  setEditingCustomFieldKey(null)
                                }
                              }}
                              onBlur={() => {
                                void handleCustomFieldSave(fieldKey)
                              }}
                            />
                          ) : (
                            <p className="mt-1">{String(value)}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              ),
            },
            {
              value: 'job-skills',
              label: 'Job and Skills',
              content: (
                <div className="space-y-4">
                  <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                    <h2 className="text-lg font-semibold text-slate-950">Employment Details</h2>
                    <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                      <p>Position: {person.position}</p>
                      <p>Grade: {person.grade}</p>
                      <p>
                        Unit:{' '}
                        {unitsQuery.data?.find((unit) => unit.id === person.unitId)?.name ??
                          person.unitId}
                      </p>
                      <p>
                        Manager:{' '}
                        {managerQuery.data
                          ? `${managerQuery.data.firstName} ${managerQuery.data.lastName}`
                          : 'N/A'}
                      </p>
                      <p>Hire date: {formatDate(person.hireDate)}</p>
                      <p>Employment status: {person.employmentStatus}</p>
                      <p>Work location: {person.workLocation}</p>
                    </div>
                  </section>
                  <EditableSection
                    title="English Level"
                    isEditing={isEditingEnglish}
                    onEdit={() => setEditingEnglish(true)}
                    onCancel={() => {
                      setEnglishLevelDraft(person.englishLevel)
                      setEditingEnglish(false)
                    }}
                    onSave={() => {
                      void updatePersonMutation
                        .mutateAsync({ englishLevel: englishLevelDraft })
                        .then(() => {
                          toast.success('Changes saved.')
                          setEditingEnglish(false)
                        })
                        .catch(() => {
                          toast.error('Could not save changes. Try again.')
                        })
                    }}
                    isSaving={updatePersonMutation.isPending}
                    readContent={<p className="text-sm text-slate-700">{person.englishLevel}</p>}
                    editContent={
                      <Select
                        value={englishLevelDraft}
                        onChange={(event) =>
                          setEnglishLevelDraft(event.target.value as Person['englishLevel'])
                        }
                      >
                        {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </Select>
                    }
                  />
                  <EditableSection
                    title="Skills"
                    isEditing={isEditingSkills}
                    onEdit={() => setEditingSkills(true)}
                    onCancel={() => setEditingSkills(false)}
                    onSave={() => {
                      if (!skillsQuery.data) {
                        return
                      }

                      void updatePersonMutation
                        .mutateAsync({
                          skills: skillsQuery.data.map((skill) => ({
                            skillId: skill.id,
                            level: (skillLevelDrafts[skill.id] ?? skill.level) as Skill['level'],
                          })),
                        })
                        .then(() => {
                          toast.success('Changes saved.')
                          setEditingSkills(false)
                        })
                        .catch(() => toast.error('Could not save changes. Try again.'))
                    }}
                    isSaving={updatePersonMutation.isPending}
                    readContent={
                      skillsQuery.isPending ? (
                        <LoadingState label="Loading skills…" />
                      ) : skillsQuery.isError ? (
                        <ErrorState
                          title="Could not load Job and Skills"
                          description="Refresh the page to try again."
                        />
                      ) : !skillsQuery.data || skillsQuery.data.length === 0 ? (
                        <EmptyState
                          title="No skills recorded"
                          description="Skills for this employee will appear here."
                        />
                      ) : (
                        <ul className="space-y-2 text-sm text-slate-700">
                          {skillsQuery.data.map((skill) => (
                            <li key={skill.id}>
                              {skill.name} - {skill.level}
                            </li>
                          ))}
                        </ul>
                      )
                    }
                    editContent={
                      <div className="space-y-3">
                        {skillsQuery.data?.map((skill) => (
                          <label
                            key={skill.id}
                            className="block text-sm font-medium text-slate-700"
                          >
                            {skill.name}
                            <Select
                              className="mt-1"
                              value={skillLevelDrafts[skill.id] ?? skill.level}
                              onChange={(event) =>
                                setSkillLevelDrafts((previous) => ({
                                  ...previous,
                                  [skill.id]: event.target.value,
                                }))
                              }
                            >
                              {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                                <option key={level} value={level}>
                                  {level}
                                </option>
                              ))}
                            </Select>
                          </label>
                        ))}
                      </div>
                    }
                  />
                </div>
              ),
            },
            {
              value: 'risks',
              label: 'Risks and Action Items',
              content: (
                <div className="space-y-4">
                  <EditableSection
                    title="Management Notes"
                    isEditing={isEditingNotes}
                    onEdit={() => setEditingNotes(true)}
                    onCancel={() => {
                      setManagementNotesDraft(person.managementNotes ?? '')
                      setEditingNotes(false)
                    }}
                    onSave={() => {
                      void updatePersonMutation
                        .mutateAsync({ managementNotes: managementNotesDraft })
                        .then(() => {
                          toast.success('Changes saved.')
                          setEditingNotes(false)
                        })
                        .catch(() => toast.error('Could not save changes. Try again.'))
                    }}
                    isSaving={updatePersonMutation.isPending}
                    readContent={
                      <p className="text-sm text-slate-700">
                        {person.managementNotes ?? 'No manager notes.'}
                      </p>
                    }
                    editContent={
                      <Textarea
                        value={managementNotesDraft}
                        placeholder="Internal notes about this employee…"
                        onChange={(event) => setManagementNotesDraft(event.target.value)}
                      />
                    }
                  />
                  <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                    <h2 className="text-lg font-semibold text-slate-950">Risk History</h2>
                    {risksQuery.isPending ? (
                      <LoadingState label="Loading risks…" className="mt-3" />
                    ) : risksQuery.isError ? (
                      <ErrorState
                        title="Could not load Risks and Action Items"
                        description="Refresh the page to try again."
                        className="mt-3"
                      />
                    ) : !risksQuery.data || risksQuery.data.length === 0 ? (
                      <EmptyState
                        className="mt-3"
                        title="No risks recorded"
                        description="Risk entries for this employee will appear here."
                      />
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {risksQuery.data.map((risk) => (
                          <li
                            key={risk.id}
                            className="flex items-center justify-between rounded-md border border-slate-200 p-3 text-sm text-slate-700"
                          >
                            <span>{risk.description}</span>
                            <StatusPill tone={getRiskTone(risk.level)}>{risk.level}</StatusPill>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                  <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                    <h2 className="text-lg font-semibold text-slate-950">Action Items</h2>
                    {actionItemsQuery.isPending ? (
                      <LoadingState label="Loading action items…" className="mt-3" />
                    ) : actionItemsQuery.isError ? (
                      <ErrorState
                        title="Could not load Risks and Action Items"
                        description="Refresh the page to try again."
                        className="mt-3"
                      />
                    ) : !actionItemsQuery.data || actionItemsQuery.data.length === 0 ? (
                      <EmptyState
                        className="mt-3"
                        title="No action items"
                        description="Action items assigned to this employee will appear here."
                      />
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {actionItemsQuery.data.map((item) => (
                          <li
                            key={item.id}
                            className="rounded-md border border-slate-200 p-3 text-sm text-slate-700"
                          >
                            <p className="font-medium">{item.title}</p>
                            <p className="mt-1 text-xs text-slate-600">
                              Due {formatDate(item.dueDate)} - {item.status}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </div>
              ),
            },
            {
              value: 'feedbacks',
              label: 'Feedbacks',
              content: feedbacksQuery.isPending ? (
                <LoadingState label="Loading feedbacks…" className="mt-3" />
              ) : feedbacksQuery.isError ? (
                <ErrorState
                  title="Could not load Feedbacks"
                  description="Refresh the page to try again."
                  className="mt-3"
                />
              ) : feedbackList.length === 0 ? (
                <EmptyState
                  className="mt-3"
                  title="No feedback recorded"
                  description="Feedback entries for this employee will appear here."
                />
              ) : (
                <ul className="space-y-2">
                  {feedbackList.map((feedback) => (
                    <li
                      key={feedback.id}
                      className="rounded-md border border-slate-200 bg-white p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                        <span>{feedback.type}</span>
                        <span>{formatDate(feedback.createdAt)}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-800">{feedback.content}</p>
                      <p className="mt-1 text-xs text-slate-500">Author: {feedback.authorId}</p>
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              value: 'resourcing-history',
              label: 'Resourcing History',
              content: assignmentHistoryQuery.isPending ? (
                <LoadingState label="Loading resourcing history…" className="mt-3" />
              ) : assignmentHistoryQuery.isError ? (
                <ErrorState
                  title="Could not load Resourcing History"
                  description="Refresh the page to try again."
                  className="mt-3"
                />
              ) : !assignmentHistoryQuery.data || assignmentHistoryQuery.data.length === 0 ? (
                <EmptyState
                  className="mt-3"
                  title="No resourcing history"
                  description="Assignment history records will appear here after a resourcing decision."
                />
              ) : (
                <ul className="space-y-2">
                  {assignmentHistoryQuery.data.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-md border border-slate-200 bg-white p-3 text-sm"
                    >
                      <p>
                        Request: {item.requestId} - Decision: {item.status}
                      </p>
                      <p className="text-xs text-slate-600">
                        Proposed: {formatDate(item.proposedAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              value: 'project-history',
              label: 'Project History',
              content: projectHistoryQuery.isPending ? (
                <LoadingState label="Loading project history…" className="mt-3" />
              ) : projectHistoryQuery.isError ? (
                <ErrorState
                  title="Could not load Project History"
                  description="Refresh the page to try again."
                  className="mt-3"
                />
              ) : !projectHistoryQuery.data || projectHistoryQuery.data.length === 0 ? (
                <EmptyState
                  className="mt-3"
                  title="No project history"
                  description="Project history records will appear here."
                />
              ) : (
                <ul className="space-y-2">
                  {projectHistoryQuery.data.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-md border border-slate-200 bg-white p-3 text-sm"
                    >
                      <p>
                        {item.projectName} ({item.role})
                      </p>
                      <p className="text-xs text-slate-600">
                        {formatDate(item.startDate)} -{' '}
                        {item.endDate ? formatDate(item.endDate) : 'Present'} (
                        {item.allocationPercent}%)
                      </p>
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              value: 'documents-idp',
              label: 'Documents and IDP',
              content: (
                <div className="space-y-4">
                  <EditableSection
                    title="IDP Reference"
                    isEditing={isEditingIdpReference}
                    onEdit={() => setEditingIdpReference(true)}
                    onCancel={() => {
                      setIdpReferenceDraft(idp?.documentReference ?? '')
                      setEditingIdpReference(false)
                    }}
                    onSave={() => {
                      void updateIdpMutation
                        .mutateAsync({ documentReference: idpReferenceDraft })
                        .then(() => {
                          toast.success('Changes saved.')
                          setEditingIdpReference(false)
                        })
                        .catch(() => toast.error('Could not save changes. Try again.'))
                    }}
                    isSaving={updateIdpMutation.isPending}
                    readContent={
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <span>{idp?.documentReference ?? 'No reference yet'}</span>
                        <StatusPill tone={getIdpTone(idp?.status ?? 'Not Started')}>
                          {idp?.status ?? 'Not Started'}
                        </StatusPill>
                      </div>
                    }
                    editContent={
                      <Input
                        value={idpReferenceDraft}
                        onChange={(event) => setIdpReferenceDraft(event.target.value)}
                      />
                    }
                  />
                  {documentsQuery.isPending ? (
                    <LoadingState label="Loading documents…" className="mt-3" />
                  ) : documentsQuery.isError ? (
                    <ErrorState
                      title="Could not load Documents and IDP"
                      description="Refresh the page to try again."
                      className="mt-3"
                    />
                  ) : !documentsQuery.data || documentsQuery.data.length === 0 ? (
                    <EmptyState
                      className="mt-3"
                      title="No documents"
                      description="Document records for this employee will appear here."
                    />
                  ) : (
                    <ul className="space-y-2">
                      {documentsQuery.data.map((document) => (
                        <li
                          key={document.id}
                          className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700"
                        >
                          <p className="font-medium">{document.name}</p>
                          <p className="mt-1 text-xs text-slate-600">
                            {document.type} - {document.visibility} -{' '}
                            {formatDate(document.uploadedAt)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ),
            },
          ]}
        />
      </section>
    </main>
  )
}
