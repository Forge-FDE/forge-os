"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Phase } from "@prisma/client"

interface AccountsTableProps {
  accounts: Array<{
    id: string
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
    sentiment: string | null
    escalationState: string | null
    dsltDays: number | null
    blockersOpen: number | null
    volume7d: number | null
    revenue7d: number | null
    qcPct7d: number | null
    automation7d: number | null
  }>
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  if (accounts.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '24px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>No accounts found</h3>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
          Try adjusting your filters or run data ingestion
        </p>
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
              <th style={headerStyle}>Account</th>
              <th style={headerStyle}>Phase</th>
              <th style={headerStyle}>STO</th>
              <th style={headerStyle}>Health</th>
              <th style={headerStyle}>Status</th>
              <th style={{...headerStyle, textAlign: 'right'}}>Volume (7d)</th>
              <th style={{...headerStyle, textAlign: 'right'}}>Revenue</th>
              <th style={{...headerStyle, textAlign: 'right'}}>QC%</th>
              <th style={{...headerStyle, textAlign: 'right'}}>Auto%</th>
              <th style={headerStyle}>Trend</th>
              <th style={headerStyle}></th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr key={account.id} style={{
                borderBottom: index < accounts.length - 1 ? '1px solid #f3f4f6' : 'none'
              }}>
                <td style={cellStyle}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{account.name}</div>
                    {account.codename && (
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{account.codename}</div>
                    )}
                  </div>
                </td>
                <td style={cellStyle}>
                  <span style={{
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {account.phase.split('_')[0].replace('P', '')}
                  </span>
                </td>
                <td style={cellStyle}>{account.sto?.name || account.sto?.email?.split('@')[0] || 'Unknown'}</td>
                <td style={cellStyle}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: getSentimentColor(account.sentiment)
                    }} />
                    {(account.dsltDays || 0) > 2 && (
                      <span style={{
                        border: '1px solid #d1d5db',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {account.dsltDays || 0}d DSLT
                      </span>
                    )}
                    {(account.blockersOpen || 0) > 0 && (
                      <span style={{
                        backgroundColor: '#fecaca',
                        color: '#991b1b',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {account.blockersOpen || 0} blocker{(account.blockersOpen || 0) > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </td>
                <td style={cellStyle}>
                  <span style={{
                    backgroundColor: getEscalationColor(account.escalationState),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {getEscalationLabel(account.escalationState)}
                  </span>
                </td>
                <td style={{...cellStyle, textAlign: 'right'}}>{(account.volume7d || 0).toLocaleString()}</td>
                <td style={{...cellStyle, textAlign: 'right'}}>
                  {(account.revenue7d || 0) > 0 ? `$${((account.revenue7d || 0) / 1000).toFixed(1)}k` : '-'}
                </td>
                <td style={{...cellStyle, textAlign: 'right'}}>
                  <span style={{ color: (account.qcPct7d || 0) >= 0.99 ? '#16a34a' : '#d97706' }}>
                    {((account.qcPct7d || 0) * 100).toFixed(1)}%
                  </span>
                </td>
                <td style={{...cellStyle, textAlign: 'right'}}>
                  <span style={{ color: (account.automation7d || 0) >= 0.3 ? '#16a34a' : '#111827' }}>
                    {((account.automation7d || 0) * 100).toFixed(1)}%
                  </span>
                </td>
                <td style={cellStyle}>Chart</td>
                <td style={cellStyle}>
                  <Link 
                    href={`/accounts/${account.id}`}
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

function getSentimentColor(sentiment: string | null) {
  switch (sentiment) {
    case 'G': return '#22c55e'
    case 'Y': return '#eab308'
    case 'R': return '#ef4444'
    default: return '#6b7280'
  }
}

function getEscalationColor(state: string | null) {
  switch (state) {
    case 'escalate': return '#dc2626'
    case 'watch': return '#d97706'
    case 'ok': return '#16a34a'
    default: return '#6b7280'
  }
}

function getEscalationLabel(state: string | null) {
  switch (state) {
    case 'escalate': return 'Escalate'
    case 'watch': return 'Watch'
    case 'ok': return 'OK'
    default: return 'Unknown'
  }
}