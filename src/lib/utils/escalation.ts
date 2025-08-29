import { Phase } from "@prisma/client"

export function calculateEscalationScore(data: {
  phase: Phase
  sentiment?: string | null
  dsltDays: number
  blockersOpen: number
  qcPct7d: number
  automation7d: number
}): { score: number; state: string } {
  let score = 0
  
  // Phase scoring
  if (data.phase === Phase.P1_PILOT) score += 30
  
  // Sentiment scoring
  if (data.sentiment === 'R') score += 25
  
  // DSLT scoring
  if (data.dsltDays > 2) score += 15
  
  // Blockers scoring
  if (data.blockersOpen > 0) score += 10
  
  // Quality scoring
  if (data.qcPct7d < 0.99) score += 10
  
  // Automation scoring
  if (data.automation7d < 0.30) score += 10
  
  // Determine state
  let state = 'none'
  if (score >= 60) state = 'escalate'
  else if (score >= 35) state = 'watch'
  
  return { score, state }
}

export function parsePhase(phaseValue: string): Phase {
  const phaseMap: Record<string, Phase> = {
    '0': Phase.P0_ALIGN,
    '1': Phase.P1_PILOT,
    '2': Phase.P2_EXPANSION,
    '3': Phase.P3_ENTERPRISE,
    '4': Phase.P4_HANDOFF,
    'P0': Phase.P0_ALIGN,
    'P1': Phase.P1_PILOT,
    'P2': Phase.P2_EXPANSION,
    'P3': Phase.P3_ENTERPRISE,
    'P4': Phase.P4_HANDOFF,
  }
  
  return phaseMap[phaseValue] || Phase.P0_ALIGN
}

export function parseBoolean(value: string | undefined): boolean {
  if (!value) return false
  const normalized = value.toLowerCase().trim()
  return normalized === 'true' || normalized === 'yes' || normalized === '1'
}

export function parseNumber(value: string | undefined, defaultValue: number = 0): number {
  if (!value) return defaultValue
  const parsed = parseFloat(value)
  return isNaN(parsed) ? defaultValue : parsed
}

export function parseDate(value: string | undefined): Date | null {
  if (!value) return null
  const date = new Date(value)
  return isNaN(date.getTime()) ? null : date
}
