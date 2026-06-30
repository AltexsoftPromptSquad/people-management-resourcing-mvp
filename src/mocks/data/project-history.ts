import { people } from './people'
import type { ProjectHistoryItem } from '@/types/project-history'

const baseProjectHistory: ProjectHistoryItem[] = [
  {
    id: 'project-history-001',
    personId: 'person-employee-001',
    projectId: 'project-001',
    projectName: 'Client Portal Modernization',
    role: 'Software Engineer',
    startDate: '2025-09-01',
    endDate: '2026-03-01',
    allocationPercent: 70,
  },
  {
    id: 'project-history-002',
    personId: 'person-employee-001',
    projectId: 'project-002',
    projectName: 'Platform Migration',
    role: 'Software Engineer',
    startDate: '2026-03-15',
    endDate: '2026-06-20',
    allocationPercent: 80,
  },
]

const generatedProjectHistory: ProjectHistoryItem[] = people.slice(0, 120).map((person, index) => ({
  id: `project-history-generated-${String(index + 1).padStart(4, '0')}`,
  personId: person.id,
  projectId: `project-generated-${String((index % 30) + 1).padStart(3, '0')}`,
  projectName: `Delivery Program ${(index % 30) + 1}`,
  role: person.position,
  startDate: `2025-${String((index % 12) + 1).padStart(2, '0')}-01`,
  endDate: `2026-${String((index % 12) + 1).padStart(2, '0')}-15`,
  allocationPercent: ((index % 5) + 1) * 20,
}))

export const projectHistory: ProjectHistoryItem[] = [
  ...baseProjectHistory,
  ...generatedProjectHistory,
]
