export const queryKeys = {
  personas: () => ['personas'] as const,
  dashboardSummary: (activePersonaId: string) => ['dashboard', 'summary', activePersonaId] as const,
  dashboardActionItems: (activePersonaId: string) =>
    ['dashboard', 'action-items', activePersonaId] as const,
  subordinates: (
    activePersonaId: string,
    requestKey: {
      position?: string
      grade?: string
      currentStatus?: string
      riskLevel?: string
      search?: string
      sortField: string
      sortDirection: string
    },
  ) => ['subordinates', activePersonaId, requestKey] as const,
}
