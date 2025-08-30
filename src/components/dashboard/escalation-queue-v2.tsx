import { Phase } from "@prisma/client"

interface EscalationQueueProps {
  accounts: Array<{
    id: string
    name: string
    phase: Phase
    sto: { name: string | null; email: string }
    dsltDays: number
    sentiment: string | null
    blockersOpen: number
    oldestBlockerAgeD: number
    nextGateDue: Date | null
    escalationScore: number
    escalationState: string
  }>
}

export function EscalationQueueV2({ accounts }: EscalationQueueProps) {
  const escalated = accounts
    .filter(a => a.escalationState !== 'none')
    .sort((a, b) => b.escalationScore - a.escalationScore)
    .slice(0, 4)
  
  const phaseColors = {
    P0_ALIGN: { backgroundColor: '#f3f4f6', color: '#374151' },
    P1_PILOT: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
    P2_EXPANSION: { backgroundColor: '#ede9fe', color: '#7c2d12' },
    P3_ENTERPRISE: { backgroundColor: '#dcfce7', color: '#166534' },
    P4_HANDOFF: { backgroundColor: '#fed7aa', color: '#c2410c' },
  }
  
  const sentimentColors = {
    R: '#ef4444',
    Y: '#eab308', 
    G: '#22c55e',
  }
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827',
          margin: '0'
        }}>
          Escalation Queue
        </h3>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={headerStyle}>Account</th>
              <th style={headerStyle}>Phase</th>
              <th style={headerStyle}>STO</th>
              <th style={headerStyle}>DSLT</th>
              <th style={headerStyle}>Sentiment</th>
              <th style={headerStyle}>Blocker Age</th>
              <th style={headerStyle}>Gate Due</th>
              <th style={headerStyle}>Score</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: 'white' }}>
            {escalated.map((account, index) => {
              const phaseNum = account.phase.split('_')[0].replace('P', '')
              const phaseStyle = phaseColors[account.phase as keyof typeof phaseColors] || phaseColors.P0_ALIGN
              
              return (
                <tr key={account.id} style={{
                  borderBottom: index < escalated.length - 1 ? '1px solid #f3f4f6' : 'none'
                }}>
                  <td style={cellStyle}>
                    <span style={{ fontWeight: '500' }}>{account.name}</span>
                  </td>
                  <td style={cellStyle}>
                    <span style={{
                      ...phaseStyle,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {phaseNum}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    {account.sto.name?.split(' ')[0] || account.sto.email.split('@')[0].toUpperCase()}
                  </td>
                  <td style={cellStyle}>
                    <span style={{ fontWeight: '500' }}>{account.dsltDays}d</span>
                  </td>
                  <td style={cellStyle}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: sentimentColors[account.sentiment as keyof typeof sentimentColors] || '#6b7280'
                    }} />
                  </td>
                  <td style={cellStyle}>
                    {account.oldestBlockerAgeD}
                  </td>
                  <td style={cellStyle}>
                    {account.nextGateDue ? `P${phaseNum}-1` : '-'}
                  </td>
                  <td style={cellStyle}>
                    {account.escalationScore}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const headerStyle = {
  padding: '12px 24px',
  textAlign: 'left' as const,
  fontSize: '12px',
  fontWeight: '500',
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em'
}

const cellStyle = {
  padding: '16px 24px',
  whiteSpace: 'nowrap' as const,
  fontSize: '14px',
  color: '#111827'
}
