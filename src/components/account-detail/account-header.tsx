import { formatDistanceToNow } from "date-fns"
import { Building2, Calendar, User } from "lucide-react"
import { Phase } from "@prisma/client"

interface AccountHeaderProps {
  account: {
    name: string
    codename: string | null
    phase: Phase
    sto: {
      id: string
      name: string | null
      email: string
      role: string
      createdAt: Date
    } | null
    sponsor: string | null
    champion: string | null
    sentiment: string | null
    dsltDays: number
    nextGateDue: Date | null
    escalationState: string
    escalationScore: number
  }
}

export function AccountHeader({ account }: AccountHeaderProps) {
  const getEscalationColor = (state: string) => {
    switch (state) {
      case 'escalate': return '#dc2626'
      case 'watch': return '#d97706'
      case 'ok': return '#16a34a'
      default: return '#6b7280'
    }
  }

  const getEscalationLabel = (state: string) => {
    switch (state) {
      case 'escalate': return 'Escalate'
      case 'watch': return 'Watch'
      case 'ok': return 'OK'
      default: return 'Unknown'
    }
  }

  const getSentimentColor = (sentiment: string | null) => {
    switch (sentiment) {
      case 'G': return '#22c55e'
      case 'Y': return '#eab308'
      case 'R': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getPhaseColor = () => {
    return '#dbeafe' // Blue background for all phases
  }

  const getPhaseLabel = (phase: Phase) => {
    return phase.split('_')[0].replace('P', 'Phase ')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1 style={{ 
            fontSize: '30px', 
            fontWeight: 'bold', 
            letterSpacing: '-0.025em', 
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '0',
            color: '#111827'
          }}>
            <Building2 style={{ width: '32px', height: '32px', color: '#6b7280' }} />
            {account.name}
          </h1>
          {account.codename && (
            <p style={{ fontSize: '16px', color: '#6b7280', margin: '0' }}>
              Codename: {account.codename}
            </p>
          )}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: getEscalationColor(account.escalationState),
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {getEscalationLabel(account.escalationState)}
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {account.escalationScore}
          </span>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {account.sto && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              {account.sto.name?.[0] || account.sto.email[0].toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: '0', color: '#111827' }}>STO</p>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                {account.sto.name || account.sto.email}
              </p>
            </div>
          </div>
        )}
        
        {account.sponsor && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User style={{ width: '16px', height: '16px', color: '#6b7280' }} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: '0', color: '#111827' }}>Sponsor</p>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>{account.sponsor}</p>
            </div>
          </div>
        )}
        
        {account.champion && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User style={{ width: '16px', height: '16px', color: '#6b7280' }} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: '0', color: '#111827' }}>Champion</p>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>{account.champion}</p>
            </div>
          </div>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar style={{ width: '16px', height: '16px', color: '#6b7280' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: '500', margin: '0', color: '#111827' }}>Next Gate</p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
              {account.nextGateDue
                ? `in ${formatDistanceToNow(new Date(account.nextGateDue))} (${account.nextGateDue.toLocaleDateString()})`
                : 'Not set'}
            </p>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{
          backgroundColor: getPhaseColor(),
          color: '#1d4ed8',
          padding: '4px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {getPhaseLabel(account.phase)}
        </span>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: getSentimentColor(account.sentiment),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {account.sentiment || '?'}
        </div>
        <span style={{
          backgroundColor: account.dsltDays > 2 ? '#fecaca' : '#e5e7eb',
          color: account.dsltDays > 2 ? '#991b1b' : '#374151',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          DSLT: {account.dsltDays} days
        </span>
      </div>
    </div>
  )
}