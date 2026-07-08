import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCustomList,
  getCustomFields,
  getCustomListRows,
  getCustomLists,
  patchCustomFieldValue,
  patchCustomList,
  shareCustomList,
  type CreateCustomListPayload,
  type PatchCustomFieldValuePayload,
  type PatchCustomListPayload,
  type ShareCustomListPayload,
} from '../api/custom-lists-api'
import { apiGet } from '@/lib/api/api-client'
import { queryKeys } from '@/lib/query/query-keys'
import type { CustomListRow } from '@/types/custom-list-row'
import type { Person } from '@/types/person'

export const useCustomFieldsQuery = (managerId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.customFields(managerId ?? 'unknown'),
    queryFn: () => getCustomFields(managerId ?? ''),
    enabled: Boolean(managerId),
  })

export const useCustomListsQuery = (managerId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.customLists(managerId ?? 'unknown'),
    queryFn: () => getCustomLists(managerId ?? ''),
    enabled: Boolean(managerId),
  })

export const useCustomListRowsQuery = (listId: string | undefined, managerId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.customListRows(listId ?? 'unknown', managerId ?? 'unknown'),
    queryFn: () => getCustomListRows(listId ?? '', managerId ?? ''),
    enabled: Boolean(listId && managerId),
  })

export const useManagerPeopleQuery = (managerId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.people(managerId),
    queryFn: () => apiGet<Person[]>('/api/people', { managerId }),
    enabled: Boolean(managerId),
  })

export const useCreateCustomListMutation = (managerId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCustomListPayload) => createCustomList(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.customLists(managerId) })
      await queryClient.invalidateQueries({ queryKey: queryKeys.customListsRoot() })
      await queryClient.invalidateQueries({ queryKey: queryKeys.customListRowsRoot() })
    },
  })
}

export const usePatchCustomListMutation = (managerId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PatchCustomListPayload }) =>
      patchCustomList(id, payload),
    onSuccess: async (updatedList) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.customLists(managerId) })
      await queryClient.invalidateQueries({ queryKey: queryKeys.customListsRoot() })
      await queryClient.invalidateQueries({ queryKey: queryKeys.customList(updatedList.id) })
      await queryClient.invalidateQueries({ queryKey: queryKeys.customListRowsRoot() })
    },
  })
}

export const useShareCustomListMutation = (managerId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ShareCustomListPayload }) =>
      shareCustomList(id, payload),
    onSuccess: async (updatedList) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.customLists(managerId) })
      await queryClient.invalidateQueries({ queryKey: queryKeys.customListsRoot() })
      await queryClient.invalidateQueries({ queryKey: queryKeys.customList(updatedList.id) })
    },
  })
}

export const usePatchCustomFieldValueMutation = (listId: string, managerId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      personId,
      payload,
    }: {
      personId: string
      payload: PatchCustomFieldValuePayload
    }) => patchCustomFieldValue(personId, payload),
    onMutate: async ({ personId, payload }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.customListRows(listId, managerId),
      })

      const previousRows = queryClient.getQueryData<CustomListRow[]>(
        queryKeys.customListRows(listId, managerId),
      )

      queryClient.setQueryData<CustomListRow[]>(
        queryKeys.customListRows(listId, managerId),
        (currentRows = []) =>
          currentRows.map((row) =>
            row.person.id === personId
              ? {
                  ...row,
                  values: {
                    ...row.values,
                    [payload.fieldId]: payload.value,
                  },
                }
              : row,
          ),
      )

      return { previousRows }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousRows) {
        queryClient.setQueryData(queryKeys.customListRows(listId, managerId), context.previousRows)
      }
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.person(variables.personId),
      })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.customListRowsRoot(),
      })
    },
  })
}
