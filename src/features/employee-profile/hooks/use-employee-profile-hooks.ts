import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/query-keys'
import {
  getPerson,
  getPersonActionItems,
  getPersonAssignmentHistory,
  getPersonDocuments,
  getPersonFeedbacks,
  getPersonIdp,
  getPersonProjectHistory,
  getPersonRisks,
  getPersonScheduledLeaves,
  getPersonSkills,
  patchIdp,
  patchPerson,
  postDocument,
  postFeedback,
  type PatchIdpPayload,
  type PatchPersonPayload,
  type PostDocumentPayload,
  type PostFeedbackPayload,
} from '../api'

export const useEmployeeProfilePersonQuery = (personId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.person(personId ?? 'unknown'),
    queryFn: () => getPerson(personId ?? ''),
    enabled: Boolean(personId),
  })

export const useEmployeeProfileFeedbacksQuery = (personId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.feedbacks(personId ?? 'unknown'),
    queryFn: () => getPersonFeedbacks(personId ?? ''),
    enabled: Boolean(personId),
  })

export const useEmployeeProfileDocumentsQuery = (personId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.documents(personId ?? 'unknown'),
    queryFn: () => getPersonDocuments(personId ?? ''),
    enabled: Boolean(personId),
  })

export const useEmployeeProfileIdpQuery = (personId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.idp(personId ?? 'unknown'),
    queryFn: () => getPersonIdp(personId ?? ''),
    enabled: Boolean(personId),
  })

export const useEmployeeProfileScheduledLeavesQuery = (personId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.scheduledLeaves(personId ?? 'unknown'),
    queryFn: () => getPersonScheduledLeaves(personId ?? ''),
    enabled: Boolean(personId),
  })

export const useEmployeeProfileRisksQuery = (personId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.risks(personId ?? 'unknown'),
    queryFn: () => getPersonRisks(personId ?? ''),
    enabled: Boolean(personId),
  })

export const useEmployeeProfileActionItemsQuery = (personId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.actionItems(personId ?? 'unknown'),
    queryFn: () => getPersonActionItems(personId ?? ''),
    enabled: Boolean(personId),
  })

export const useEmployeeProfileProjectHistoryQuery = (personId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.projectHistory(personId ?? 'unknown'),
    queryFn: () => getPersonProjectHistory(personId ?? ''),
    enabled: Boolean(personId),
  })

export const useEmployeeProfileAssignmentHistoryQuery = (personId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.assignmentHistory(personId ?? 'unknown'),
    queryFn: () => getPersonAssignmentHistory(personId ?? ''),
    enabled: Boolean(personId),
  })

export const useEmployeeProfileSkillsQuery = (personId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.skills(personId ?? 'unknown'),
    queryFn: () => getPersonSkills(personId ?? ''),
    enabled: Boolean(personId),
  })

export const useUpdatePersonMutation = (personId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PatchPersonPayload) => patchPerson(personId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.person(personId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.skills(personId) })
    },
  })
}

export const useAddFeedbackMutation = (personId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PostFeedbackPayload) => postFeedback(personId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.feedbacks(personId) })
    },
  })
}

export const useAddDocumentMutation = (personId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PostDocumentPayload) => postDocument(personId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.documents(personId) })
    },
  })
}

export const useUpdateIdpMutation = (personId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PatchIdpPayload) => patchIdp(personId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.idp(personId) })
    },
  })
}
