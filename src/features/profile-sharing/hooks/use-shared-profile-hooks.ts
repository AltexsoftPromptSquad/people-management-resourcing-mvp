import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createSharedProfile,
  getSharedProfile,
  type CreateSharedProfilePayload,
} from '../api/shared-profile-api'
import { queryKeys } from '@/lib/query/query-keys'

export const useSharedProfileQuery = (token: string | undefined) =>
  useQuery({
    queryKey: queryKeys.sharedProfile(token ?? 'unknown'),
    queryFn: () => getSharedProfile(token ?? ''),
    enabled: Boolean(token),
    retry: false,
  })

export const useCreateSharedProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSharedProfilePayload) => createSharedProfile(payload),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.sharedProfile(data.token) })
    },
  })
}
