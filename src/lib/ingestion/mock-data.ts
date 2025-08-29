import { SheetRow, ActionRow, TouchRow } from '@/types/ingestion'

export function generateMockSheetData(accountName: string): {
  rollup: SheetRow
  actions: ActionRow[]
  touches: TouchRow[]
} {
  const phases = ['0', '1', '2', '3', '4']
  const sentiments = ['R', 'Y', 'G']
  const channels = ['exec', 'team', 'email', 'call']
  const severities = ['sev-0', 'sev-1', 'sev-2']
  const statuses = ['open', 'at_risk', 'closed']
  
  const randomPhase = phases[Math.floor(Math.random() * phases.length)]
  const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)]
  
  const rollup: SheetRow = {
    account: accountName,
    workflow: '— all —',
    phase: randomPhase,
    sto: 'sto@forge-os.com',
    sponsor: 'John Sponsor',
    champion: 'Jane Champion',
    golden10: Math.random() > 0.5 ? 'true' : 'false',
    accessReady: Math.random() > 0.5 ? 'true' : 'false',
    volume7d: Math.floor(Math.random() * 10000).toString(),
    revenue7d: Math.floor(Math.random() * 50000).toString(),
    cost7d: Math.floor(Math.random() * 30000).toString(),
    qcPct7d: (0.9 + Math.random() * 0.1).toFixed(2),
    aht7d: (100 + Math.random() * 200).toFixed(0),
    p95ms7d: (200 + Math.random() * 800).toFixed(0),
    automation7d: (Math.random() * 0.5).toFixed(2),
    budgetUtil7d: (0.5 + Math.random() * 0.5).toFixed(2),
    dsltDays: Math.floor(Math.random() * 10).toString(),
    blockersOpen: Math.floor(Math.random() * 5).toString(),
    oldestBlockerAgeD: Math.floor(Math.random() * 30).toString(),
    sentiment: randomSentiment,
    notes: `${accountName} is progressing through phase ${randomPhase}`,
    nextGateDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    nextMilestone: 'Complete integration testing',
    wgSentiment: randomSentiment,
  }
  
  const actions: ActionRow[] = []
  const numActions = Math.floor(Math.random() * 5) + 1
  
  for (let i = 0; i < numActions; i++) {
    actions.push({
      title: `Action item ${i + 1} for ${accountName}`,
      severity: severities[Math.floor(Math.random() * severities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      responsible: 'Team Lead',
      dueDate: new Date(Date.now() + (7 + i * 7) * 24 * 60 * 60 * 1000).toISOString(),
      openedAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
      slackLink: `https://slack.com/archives/C123456/p${Date.now()}`,
      docLink: `https://docs.google.com/document/d/abc${i}`,
    })
  }
  
  const touches: TouchRow[] = []
  const numTouches = Math.floor(Math.random() * 10) + 5
  
  for (let i = 0; i < numTouches; i++) {
    touches.push({
      touchedAt: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString(),
      actor: ['John STO', 'Jane FDE', 'Mike PM'][Math.floor(Math.random() * 3)],
      channel: channels[Math.floor(Math.random() * channels.length)],
      summary: `Follow up on ${accountName} progress`,
    })
  }
  
  return { rollup, actions, touches }
}
