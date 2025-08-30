"use client"

import { Phase } from "@prisma/client"
import Link from "next/link"

interface EscalationQueueProps {
  workflows: Array<{
    id: string
    name: string
    phase: Phase
    dueDate: Date | null
    wgSentiment: string | null
    account: {
      id: string
      name: string
      escalationState: string
      escalationScore: number
      oldestBlockerAgeD: number
      nextGateDue: Date | null
      sentiment: string | null
    }
    ownerFde: {
      id: string
      name: string | null
    } | null
    actions: Array<{
      id: string
      severity: string
      dueDate: Date | null
      title: string
    }>
  }>
}

export function EscalationQueueV2({ workflows }: EscalationQueueProps) {
  // Take top 6 escalated workflows
  const escalatedWorkflows = workflows.slice(0, 6)
  
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'sev-0': return '#dc2626'
      case 'sev-1': return '#ea580c'
      case 'sev-2': return '#ca8a04'
      default: return '#6b7280'
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'No due date'
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)}d overdue`
    } else if (diffDays === 0) {
      return 'Due today'
    } else {
      return `${diffDays}d remaining`
    }
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
        borderBottom: '1px solid #e5e7eb'
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
      
      {escalatedWorkflows.length === 0 ? (
        <div style={{ 
          padding: '40px 24px', 
          textAlign: 'center', 
          color: '#6b7280' 
        }}>
          <p>No escalated workflows found</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ 
            width: '100%', 
            minWidth: '1000px',
            borderCollapse: 'collapse', 
            tableLayout: 'fixed' 
          }}>
            <colgroup>
              <col style={{ width: '200px' }} />
              <col style={{ width: '150px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '100px' }} />
            </colgroup>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>WORKFLOW</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>ACCOUNT</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>PHASE</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>OWNER</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>ACTIONS</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>DUE</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>SENTIMENT</th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>SCORE</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {escalatedWorkflows.map((workflow, index) => (
                <Link key={workflow.id} href={`/workflows/${workflow.id}`} style={{ textDecoration: 'none' }}>
                  <tr 
                    style={{
                      borderBottom: index < escalatedWorkflows.length - 1 ? '1px solid #f3f4f6' : 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <td style={{
                      padding: '16px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#111827',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {workflow.name}
                    </td>
                    <td style={{
                      padding: '16px 16px',
                      fontSize: '14px',
                      color: '#6b7280',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {workflow.account.name}
                    </td>
                    <td style={{ padding: '16px 16px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        ...phaseColors[workflow.phase]
                      }}>
                        {workflow.phase.replace('P', 'P').replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px 16px',
                      fontSize: '14px',
                      color: '#6b7280',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {workflow.ownerFde?.name || 'Unassigned'}
                    </td>
                    <td style={{
                      padding: '16px 16px',
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        {workflow.actions.slice(0, 3).map((action) => (
                          <div
                            key={action.id}
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: getSeverityColor(action.severity)
                            }}
                            title={`${action.severity}: ${action.title}`}
                          />
                        ))}
                        {workflow.actions.length > 3 && (
                          <span style={{ 
                            fontSize: '10px', 
                            color: '#6b7280', 
                            marginLeft: '4px' 
                          }}>
                            +{workflow.actions.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{
                      padding: '16px 16px',
                      fontSize: '12px',
                      color: workflow.dueDate && new Date(workflow.dueDate) < new Date() ? '#dc2626' : '#6b7280',
                      whiteSpace: 'nowrap'
                    }}>
                      {formatDate(workflow.dueDate)}
                    </td>
                    <td style={{
                      padding: '16px 16px',
                      textAlign: 'center'
                    }}>
                      {workflow.wgSentiment && (
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: sentimentColors[workflow.wgSentiment as keyof typeof sentimentColors] || '#d1d5db',
                            margin: '0 auto'
                          }}
                        />
                      )}
                    </td>
                    <td style={{
                      padding: '16px 16px',
                      textAlign: 'right',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {workflow.account.escalationScore}
                    </td>
                  </tr>
                </Link>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}