import type { FC } from 'react'
import { useEffect, useState } from 'react'
import {
  useAddDocumentMutation,
  useEmployeeProfileActionItemsQuery,
  useEmployeeProfileDocumentsQuery,
  useEmployeeProfileIdpQuery,
  useEmployeeProfilePersonQuery,
  useUpdateIdpMutation,
  useUpdatePersonMutation,
} from '@/features/employee-profile'
import { useActivePersona } from '@/features/roles/hooks/use-active-persona'
import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { Input } from '@/shared/ui/input'
import { LoadingState } from '@/shared/ui/loading-state'
import { PageHeader } from '@/shared/ui/page-header'
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
import { toast } from '@/shared/ui/toast'
import type { MyProfilePageProps } from './MyProfilePage.types'

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const formatPhone = (phone: string) => phone.replace(/\s*x\d+$/i, '').trim()

const getIdpTone = (status: string) =>
  status === 'Completed' ? 'success' : status === 'In Progress' ? 'info' : 'neutral'

export const MyProfilePage: FC<MyProfilePageProps> = () => {
  const { activePersona, isError, isPending } = useActivePersona()
  const [isEditingContact, setEditingContact] = useState(false)
  const [phoneDraft, setPhoneDraft] = useState('')
  const [emailDraft, setEmailDraft] = useState('')
  const [addressLineDraft, setAddressLineDraft] = useState('')
  const [cityDraft, setCityDraft] = useState('')
  const [countryDraft, setCountryDraft] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [isCertificateSheetOpen, setCertificateSheetOpen] = useState(false)
  const [certificateName, setCertificateName] = useState('')
  const [certificateFileName, setCertificateFileName] = useState('')
  const [certificateErrors, setCertificateErrors] = useState<{ name?: string; fileName?: string }>(
    {},
  )

  const personQuery = useEmployeeProfilePersonQuery(activePersona?.personId)
  const actionItemsQuery = useEmployeeProfileActionItemsQuery(activePersona?.personId)
  const documentsQuery = useEmployeeProfileDocumentsQuery(activePersona?.personId)
  const idpQuery = useEmployeeProfileIdpQuery(activePersona?.personId)
  const updatePersonMutation = useUpdatePersonMutation(activePersona?.personId ?? '')
  const updateIdpMutation = useUpdateIdpMutation(activePersona?.personId ?? '')
  const addDocumentMutation = useAddDocumentMutation(activePersona?.personId ?? '')

  useEffect(() => {
    if (isEditingContact || !personQuery.data) {
      return
    }

    setPhoneDraft(personQuery.data.personalPhone)
    setEmailDraft(personQuery.data.personalEmail)
    setAddressLineDraft(personQuery.data.address.addressLine)
    setCityDraft(personQuery.data.address.city)
    setCountryDraft(personQuery.data.address.country)
  }, [isEditingContact, personQuery.data])

  if (isPending) {
    return <LoadingState label="Loading employee workspace" className="mx-auto mt-10 max-w-7xl" />
  }

  if (!activePersona || personQuery.isPending) {
    return <LoadingState label="Loading personal profile…" className="mx-auto mt-10 max-w-7xl" />
  }

  if (isError || personQuery.isError || !personQuery.data) {
    return (
      <ErrorState
        className="mx-auto mt-10 max-w-7xl"
        title="Could not load profile"
        description="Refresh the page or return to the list."
      />
    )
  }

  const person = personQuery.data
  const idp = idpQuery.data ?? null

  const handleSaveContact = async () => {
    if (emailDraft && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailDraft)) {
      setEmailError('Enter a valid email address.')
      return
    }

    setEmailError(null)

    try {
      await updatePersonMutation.mutateAsync({
        personalPhone: phoneDraft,
        personalEmail: emailDraft,
        address: {
          addressLine: addressLineDraft,
          city: cityDraft,
          country: countryDraft,
        },
      })
      toast.success('Contact information saved.')
      setEditingContact(false)
    } catch {
      toast.error('Could not save changes. Try again.')
    }
  }

  const handleCertificateSubmit = async () => {
    const nextErrors: { name?: string; fileName?: string } = {}

    if (!certificateName.trim()) {
      nextErrors.name = 'Certificate name is required.'
    }

    if (!certificateFileName.trim()) {
      nextErrors.fileName = 'File name is required.'
    }

    setCertificateErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    try {
      await addDocumentMutation.mutateAsync({
        name: certificateName.trim(),
        type: 'Certificate',
        mockFileName: certificateFileName.trim(),
        uploadedById: person.id,
        visibility: 'Employee Visible',
      })
      toast.success('Certificate added.')
      setCertificateSheetOpen(false)
      setCertificateName('')
      setCertificateFileName('')
      setCertificateErrors({})
    } catch {
      toast.error('Could not add certificate. Try again.')
    }
  }

  return (
    <main className="px-6 py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <PageHeader
          eyebrow={activePersona.displayName}
          title="My Profile"
          description="Manage your contact details, action items, IDP status, and certificates."
        />

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-lg font-semibold text-slate-950">Profile</h2>
          <p className="mt-2 text-sm text-slate-700">
            {person.firstName} {person.lastName} · {person.position} · {person.grade}
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-950">Contact Information</h2>
            {isEditingContact ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingContact(false)}
                  disabled={updatePersonMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => void handleSaveContact()}
                  disabled={updatePersonMutation.isPending}
                  aria-busy={updatePersonMutation.isPending}
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingContact(true)}
              >
                Edit
              </Button>
            )}
          </div>

          {isEditingContact ? (
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Personal phone
                <Input
                  className="mt-1"
                  value={phoneDraft}
                  onChange={(event) => setPhoneDraft(event.target.value)}
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Personal email
                <Input
                  className="mt-1"
                  value={emailDraft}
                  onBlur={() => {
                    if (emailDraft && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailDraft)) {
                      setEmailError('Enter a valid email address.')
                    } else {
                      setEmailError(null)
                    }
                  }}
                  onChange={(event) => {
                    setEmailDraft(event.target.value)
                    setEmailError(null)
                  }}
                />
                {emailError ? <p className="mt-1 text-sm text-red-700">{emailError}</p> : null}
              </label>
              <label className="text-sm font-medium text-slate-700">
                Address line
                <Input
                  className="mt-1"
                  value={addressLineDraft}
                  onChange={(event) => setAddressLineDraft(event.target.value)}
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                City
                <Input
                  className="mt-1"
                  value={cityDraft}
                  onChange={(event) => setCityDraft(event.target.value)}
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Country
                <Input
                  className="mt-1"
                  value={countryDraft}
                  onChange={(event) => setCountryDraft(event.target.value)}
                />
              </label>
            </div>
          ) : (
            <div className="space-y-1 text-sm text-slate-700">
              <p>Personal phone: {formatPhone(person.personalPhone)}</p>
              <p>Personal email: {person.personalEmail}</p>
              <p>
                Address: {person.address.addressLine}, {person.address.city},{' '}
                {person.address.country}
              </p>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-lg font-semibold text-slate-950">Action Items</h2>
          {actionItemsQuery.isPending ? (
            <LoadingState label="Loading action items…" className="mt-3" />
          ) : actionItemsQuery.isError ? (
            <ErrorState
              title="Could not load Action Items"
              description="Refresh the page to try again."
              className="mt-3"
            />
          ) : !actionItemsQuery.data || actionItemsQuery.data.length === 0 ? (
            <EmptyState
              className="mt-3"
              title="No action items"
              description="Action items assigned to you by your manager will appear here."
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
                    Due {formatDate(item.dueDate)} · {item.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-lg font-semibold text-slate-950">IDP Status</h2>
          <div className="mt-3 flex max-w-sm items-center gap-3">
            <Select
              value={idp?.status ?? 'Not Started'}
              onChange={(event) => {
                void updateIdpMutation
                  .mutateAsync({
                    status: event.target.value as 'Not Started' | 'In Progress' | 'Completed',
                  })
                  .then(() => toast.success('IDP status updated.'))
                  .catch(() => toast.error('Could not save changes. Try again.'))
              }}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Select>
            <StatusPill tone={getIdpTone(idp?.status ?? 'Not Started')}>
              {idp?.status ?? 'Not Started'}
            </StatusPill>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-950">Documents</h2>
            <Sheet open={isCertificateSheetOpen} onOpenChange={setCertificateSheetOpen}>
              <SheetTrigger asChild>
                <Button type="button" size="sm">
                  Add Certificate
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Add Certificate</SheetTitle>
                  <SheetDescription>Add a certificate document to your profile.</SheetDescription>
                </SheetHeader>
                <div className="mt-5 space-y-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Certificate name *
                    <Input
                      className="mt-1"
                      value={certificateName}
                      placeholder="e.g. AWS Solutions Architect"
                      onChange={(event) => {
                        setCertificateName(event.target.value)
                        setCertificateErrors((previous) => ({ ...previous, name: undefined }))
                      }}
                    />
                    {certificateErrors.name ? (
                      <p className="mt-1 text-sm text-red-700">{certificateErrors.name}</p>
                    ) : null}
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    File name *
                    <Input
                      className="mt-1"
                      value={certificateFileName}
                      placeholder="e.g. certificate.pdf (mock — no actual upload)"
                      onChange={(event) => {
                        setCertificateFileName(event.target.value)
                        setCertificateErrors((previous) => ({ ...previous, fileName: undefined }))
                      }}
                    />
                    {certificateErrors.fileName ? (
                      <p className="mt-1 text-sm text-red-700">{certificateErrors.fileName}</p>
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
                    onClick={() => void handleCertificateSubmit()}
                    disabled={addDocumentMutation.isPending}
                    aria-busy={addDocumentMutation.isPending}
                  >
                    Save Certificate
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {documentsQuery.isPending ? (
            <LoadingState label="Loading documents…" className="mt-3" />
          ) : documentsQuery.isError ? (
            <ErrorState
              title="Could not load Documents"
              description="Refresh the page to try again."
              className="mt-3"
            />
          ) : !documentsQuery.data || documentsQuery.data.length === 0 ? (
            <EmptyState
              className="mt-3"
              title="No documents"
              description="Documents shared with you will appear here."
            />
          ) : (
            <ul className="space-y-2">
              {documentsQuery.data.map((document) => (
                <li
                  key={document.id}
                  className="rounded-md border border-slate-200 p-3 text-sm text-slate-700"
                >
                  <p className="font-medium">{document.name}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {document.type} · {document.visibility} · {formatDate(document.uploadedAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  )
}
