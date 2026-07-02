import type { ActionItem } from '@/types/action-item'
import type { DocumentRecord } from '@/types/document'
import type { IdpRecord } from '@/types/idp'
import type { Person } from '@/types/person'

export type PersonalProfileViewProps = {
  person: Person
  actionItems: ActionItem[]
  documents: DocumentRecord[]
  idp: IdpRecord | null
}
