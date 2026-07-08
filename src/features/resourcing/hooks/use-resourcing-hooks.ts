import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createResourcingRequest,
  getCandidateProposals,
  getResourcingRequest,
  patchCandidateProposal,
  patchResourcingRequest,
  submitCandidateProposals,
  type CreateResourcingRequestPayload,
  type PatchCandidateProposalPayload,
  type PatchResourcingRequestPayload,
  type SubmitCandidateProposalsPayload,
} from '../api/resourcing-api'
import { getResourcingAssignments } from '../api/get-resourcing-assignments'
import { getResourcingRequests } from '../api/get-resourcing-requests'
import { queryKeys } from '@/lib/query/query-keys'

type RequestFilter = {
  createdById?: string
  assignedManagerId?: string
}

export const useResourcingRequestsQuery = (filter: RequestFilter) =>
  useQuery({
    queryKey: queryKeys.resourcingRequests(filter),
    queryFn: () => getResourcingRequests(filter),
  })

export const useResourcingAssignmentsQuery = (managerId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.assignments(managerId ?? 'unknown'),
    queryFn: () => getResourcingAssignments(managerId ?? ''),
    enabled: Boolean(managerId),
  })

export const useResourcingRequestQuery = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.resourcingRequest(id ?? 'unknown'),
    queryFn: () => getResourcingRequest(id ?? ''),
    enabled: Boolean(id),
  })

export const useCandidateProposalsQuery = (requestId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.candidateProposals(requestId ?? 'unknown'),
    queryFn: () => getCandidateProposals(requestId ?? ''),
    enabled: Boolean(requestId),
  })

export const useCreateAndSubmitRequestMutation = (createdById: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateResourcingRequestPayload) => {
      const created = await createResourcingRequest(payload)
      return patchResourcingRequest(created.id, { status: 'Submitted' })
    },
    onSuccess: (submittedRequest) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.resourcingRequestsRoot() })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.resourcingRequests({ createdById }),
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.resourcingRequest(submittedRequest.id),
      })
    },
  })
}

export const usePatchResourcingRequestMutation = (filter: RequestFilter) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PatchResourcingRequestPayload }) =>
      patchResourcingRequest(id, payload),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.resourcingRequests(filter) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.resourcingRequest(data.id) })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.resourcingRequests({ assignedManagerId: data.assignedUnitManagerId }),
      })
    },
  })
}

export const useSubmitCandidateProposalsMutation = (requestId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SubmitCandidateProposalsPayload) => submitCandidateProposals(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.candidateProposals(requestId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.resourcingRequest(requestId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.resourcingRequestsRoot() })
    },
  })
}

export const usePatchCandidateProposalMutation = (requestId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PatchCandidateProposalPayload }) =>
      patchCandidateProposal(id, payload),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.candidateProposals(requestId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.resourcingRequest(requestId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.resourcingRequestsRoot() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.assignmentHistoryRoot() })

      if (data.employeeId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.assignmentHistory(data.employeeId),
        })
      }
    },
  })
}
