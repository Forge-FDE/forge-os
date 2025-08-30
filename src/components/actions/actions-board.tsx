"use client"

import { AlertTriangle, Clock, FileText, Slack, Building2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Action {
  id: string
  title: string
  severity: string
  status: string
  responsible: string
  dueDate: Date | null
  openedAt: Date
  ageD: number
  slackLink: string | null
  docLink: string | null
  account: {
    id: string
    name: string
  }
  workflow: {
    name: string
  } | null
}

interface ActionsBoardProps {
  actions: Action[]
}

export function ActionsBoard({ actions }: ActionsBoardProps) {
  const openActions = actions.filter(a => a.status === 'open')
  const atRiskActions = actions.filter(a => a.status === 'at_risk')
  
  const ActionCard = ({ action }: { action: Action }) => {
    const severityConfig = {
      'sev-0': { backgroundColor: '#fecaca', color: '#991b1b', label: 'SEV-0' },
      'sev-1': { backgroundColor: '#fecaca', color: '#991b1b', label: 'SEV-1' },
      'sev-2': { backgroundColor: '#e5e7eb', color: '#374151', label: 'SEV-2' },
    }
    
    const config = severityConfig[action.severity as keyof typeof severityConfig] || severityConfig['sev-2']
    const isOverdue = action.dueDate && new Date(action.dueDate) < new Date()
    const isAging = action.ageD > (action.severity === 'sev-1' ? 2 : 5)
    
    const cardStyle = {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: isAging ? '1px solid #ef4444' : '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }
    
    return (
      <div style={cardStyle}>
        <div style={{ padding: '16px 16px 12px 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                backgroundColor: config.backgroundColor,
                color: config.color,
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {config.label}
              </span>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                fontSize: '12px', 
                color: isAging ? '#dc2626' : '#6b7280' 
              }}>
                <Clock style={{ 
                  width: '12px', 
                  height: '12px', 
                  color: isAging ? '#dc2626' : '#6b7280' 
                }} />
                <span style={{ 
                  color: isAging ? '#dc2626' : '#6b7280',
                  fontWeight: isAging ? '500' : 'normal'
                }}>
                  {action.ageD}d
                </span>
              </div>
            </div>
            <h4 style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              margin: '0', 
              color: '#111827',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {action.title}
            </h4>
          </div>
        </div>
        <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              <Building2 style={{ width: '12px', height: '12px', color: '#6b7280' }} />
              <span style={{ fontWeight: '500', color: '#111827' }}>{action.account.name}</span>
            </div>
            {action.workflow && (
              <p style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                margin: '0 0 0 16px' 
              }}>
                {action.workflow.name}
              </p>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#111827' }}>
              {action.responsible}
            </span>
            {action.dueDate && (
              <span style={{ 
                fontSize: '12px', 
                color: isOverdue ? '#dc2626' : '#6b7280',
                fontWeight: isOverdue ? '500' : 'normal'
              }}>
                Due {formatDistanceToNow(new Date(action.dueDate), { addSuffix: true })}
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '4px' }}>
            {action.slackLink && (
              <a 
                href={action.slackLink} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  color: '#6b7280',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Slack style={{ width: '12px', height: '12px' }} />
              </a>
            )}
            {action.docLink && (
              <a 
                href={action.docLink} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  color: '#6b7280',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <FileText style={{ width: '12px', height: '12px' }} />
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  const columnStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px'
  }

  const emptyStateStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '24px',
    textAlign: 'center' as const,
    fontSize: '14px',
    color: '#6b7280'
  }
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '24px'
    }}>
      <div style={columnStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            margin: '0',
            color: '#111827'
          }}>
            Open ({openActions.length})
          </h2>
          {openActions.some(a => a.severity === 'sev-0' || a.severity === 'sev-1') && (
            <AlertTriangle style={{ width: '20px', height: '20px', color: '#dc2626' }} />
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {openActions.map(action => (
            <ActionCard key={action.id} action={action} />
          ))}
          {openActions.length === 0 && (
            <div style={emptyStateStyle}>
              No open actions
            </div>
          )}
        </div>
      </div>
      
      <div style={columnStyle}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          margin: '0',
          color: '#111827'
        }}>
          At Risk ({atRiskActions.length})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {atRiskActions.map(action => (
            <ActionCard key={action.id} action={action} />
          ))}
          {atRiskActions.length === 0 && (
            <div style={emptyStateStyle}>
              No at-risk actions
            </div>
          )}
        </div>
      </div>
    </div>
  )
}