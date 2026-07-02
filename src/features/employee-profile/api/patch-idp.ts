import { apiPatch } from '@/lib/api/api-client'
import type { IdpRecord, IdpStatus } from '@/types/idp'

export type PatchIdpPayload = {
  status?: IdpStatus
  documentReference?: string
}

export const patchIdp = (personId: string, payload: PatchIdpPayload) =>
  apiPatch<IdpRecord, PatchIdpPayload>(`/api/people/${personId}/idp`, payload)
