import { apiPatch } from '@/lib/api/api-client'
import type { Person, PersonAddress } from '@/types/person'
import type { Skill } from '@/types/skill'

export type PatchPersonPayload = {
  personalPhone?: string
  personalEmail?: string
  address?: string | PersonAddress
  englishLevel?: Person['englishLevel']
  skills?: Array<{ skillId: string; level: Skill['level'] }>
  managementNotes?: string
  customFieldValues?: Person['customFieldValues']
}

export const patchPerson = (personId: string, payload: PatchPersonPayload) =>
  apiPatch<Person, PatchPersonPayload>(`/api/people/${personId}`, payload)
