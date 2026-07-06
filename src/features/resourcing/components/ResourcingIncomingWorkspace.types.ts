import type { CandidateWarning } from '../constants/copy'
import type { Person } from '@/types/person'

export type SelectedCandidate = {
  person: Person
  fitSummary: string
  warnings: CandidateWarning[]
  sharedProfileId?: string
  sharedProfileToken?: string
}

export type ExternalCandidate = {
  url: string
  fitSummary: string
}
