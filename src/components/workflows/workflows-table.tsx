import Link from "next/link"
import { CheckCircle, ExternalLink } from "lucide-react"
import { Phase } from "@prisma/client"

interface WorkflowsTableProps {
  workflows: Array<{
    id: string
    name: string
    phase: Phase
    account: {
      id: string
      name: string
    }
    ownerFde: {
      name: string | null
      email: string
    } | null
    golden10: boolean
    accessReady: boolean
    volume7d: number
    qcPct7d: number
    aht7d: number
    automation7d: number
    budgetUtil7d: number
    nextMilestone: string | null
    wgSentiment: string | null
    actions: Array<{
      id: string
      status: string
    }>
  }>
}

export function WorkflowsTable({ workflows }: WorkflowsTableProps) {
  if (workflows.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '24px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        No workflows found. Workflows will appear after data ingestion.
      </div>
    )
  }
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={headerStyle}>Workflow</th>
              <th style={headerStyle}>Account</th>
              <th style={headerStyle}>Phase</th>
              <th style={headerStyle}>Owner</th>
              <th style={headerStyle}>Status</th>
              <th style={{...headerStyle, textAlign: 'right'}}>Volume</th>
              <th style={{...headerStyle, textAlign: 'right'}}>QC%</th>
              <th style={{...headerStyle, textAlign: 'right'}}>Auto%</th>
              <th style={{...headerStyle, textAlign: 'right'}}>Budget</th>
              <th style={headerStyle}>Health</th>
              <th style={headerStyle}>Actions</th>
              <th style={headerStyle}></th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((workflow, index) => (
              <tr key={workflow.id} style={{
                borderBottom: index < workflows.length - 1 ? '1px solid #f3f4f6' : 'none'
              }}>
                <td style={{...cellStyle, fontWeight: '500'}}>{workflow.name}</td>
                <td style={cellStyle}>{workflow.account.name}</td>
                <td style={cellStyle}>
                  <span style={{
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {workflow.phase.split('_')[0].replace('P', '')}
                  </span>
                </td>
                <td style={cellStyle}>
                  {workflow.ownerFde 
                    ? workflow.ownerFde.name || workflow.ownerFde.email.split('@')[0]
                    : '-'}
                </td>
                <td style={cellStyle}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {workflow.golden10 && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: '1px solid #d1d5db',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        <CheckCircle style={{ width: '8px', height: '8px' }} />
                        G10
                      </span>
                    )}
                    {workflow.accessReady && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: '1px solid #d1d5db',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        <CheckCircle style={{ width: '8px', height: '8px' }} />
                        Ready
                      </span>
                    )}
                  </div>
                </td>
                <td style={{...cellStyle, textAlign: 'right'}}>
                  {workflow.volume7d.toLocaleString()}
                </td>
                <td style={{...cellStyle, textAlign: 'right'}}>
                  <span style={{ color: workflow.qcPct7d >= 0.99 ? '#16a34a' : '#d97706' }}>
                    {(workflow.qcPct7d * 100).toFixed(1)}%
                  </span>
                </td>
                <td style={{...cellStyle, textAlign: 'right'}}>
                  {(workflow.automation7d * 100).toFixed(0)}%
                </td>
                <td style={{...cellStyle, textAlign: 'right'}}>
                  <span style={{ color: workflow.budgetUtil7d > 0.9 ? '#dc2626' : '#111827' }}>
                    {(workflow.budgetUtil7d * 100).toFixed(0)}%
                  </span>
                </td>
                <td style={cellStyle}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: getHealthColor(workflow.wgSentiment)
                  }} />
                </td>
                <td style={cellStyle}>
                  {workflow.actions.length > 0 && (
                    <span style={{
                      backgroundColor: '#fecaca',
                      color: '#991b1b',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {workflow.actions.length}
                    </span>
                  )}
                </td>
                <td style={cellStyle}>
                  <Link 
                    href={`/accounts/${workflow.account.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '24px',
                      borderRadius: '4px',
                      color: '#6b7280',
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink style={{ width: '16px', height: '16px' }} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const headerStyle = {
  padding: '12px 16px',
  textAlign: 'left' as const,
  fontSize: '12px',
  fontWeight: '500',
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em'
}

const cellStyle = {
  padding: '12px 16px',
  fontSize: '14px',
  color: '#111827'
}

function getHealthColor(sentiment: string | null) {
  switch (sentiment) {
    case 'G': return '#22c55e'
    case 'Y': return '#eab308'
    case 'R': return '#ef4444'
    default: return '#6b7280'
  }
}
