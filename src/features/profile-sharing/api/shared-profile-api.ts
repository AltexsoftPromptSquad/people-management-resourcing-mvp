import { apiGet, apiPost } from '@/lib/api/api-client'
import type { SharedProfile, SharedProfileSection } from '@/types/shared-profile'
import type { SharedProfileView } from '@/types/shared-profile-view'

export type CreateSharedProfilePayload = {
  personId: string
  allowedSections: SharedProfileSection[]
  createdById: string
}

export const createSharedProfile = (payload: CreateSharedProfilePayload) =>
  apiPost<SharedProfile, CreateSharedProfilePayload>('/api/shared-profiles', payload)

export const getSharedProfile = (token: string) =>
  apiGet<SharedProfileView>(`/api/shared-profiles/${token}`)

export const getActiveSharedProfile = (personId: string) =>
  apiGet<SharedProfile | null>('/api/shared-profiles/active', { personId })
