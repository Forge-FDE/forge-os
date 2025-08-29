export interface SheetRow {
  account: string
  workflow: string
  phase: string
  sto: string
  sponsor?: string
  champion?: string
  golden10: string
  accessReady: string
  volume7d: string
  revenue7d: string
  cost7d: string
  qcPct7d: string
  aht7d: string
  p95ms7d: string
  automation7d: string
  budgetUtil7d: string
  dsltDays: string
  blockersOpen: string
  oldestBlockerAgeD: string
  sentiment?: string
  notes?: string
  nextGateDue?: string
  nextMilestone?: string
  wgSentiment?: string
}

export interface ActionRow {
  title: string
  severity: string
  status: string
  responsible: string
  dueDate?: string
  openedAt?: string
  slackLink?: string
  docLink?: string
}

export interface TouchRow {
  touchedAt: string
  actor: string
  channel: string
  summary?: string
}

export interface IngestionResult {
  success: boolean
  accountsProcessed: number
  actionsProcessed: number
  touchesProcessed: number
  errors: string[]
  timestamp: Date
}
