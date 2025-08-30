"use client"

import Link from "next/link"
// import { LineChart, Line, ResponsiveContainer } from "recharts"

interface PaidAccountsProps {
  accounts: Array<{
    id: string
    name: string
    revenue7d: number
    cost7d: number
    gm7d: number
    volume7d: number
    qcPct7d: number
    aht7d: number
  }>
  compact?: boolean
}

export function PaidAccountsV2({ accounts, compact = false }: PaidAccountsProps) {
  const paidAccounts = accounts.filter(a => a.revenue7d > 0).slice(0, compact ? 3 : 6)
  
  if (compact) {
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
            Paid Accounts <span style={{ 
              fontSize: '14px', 
              fontWeight: '400', 
              color: '#6b7280' 
            }}>(rev/cost/SLAs)</span>
          </h3>
        </div>
        <div style={{ padding: '24px' }}>
          {paidAccounts.map((account) => (
            <Link key={account.id} href={`/accounts/${account.id}`} style={{ textDecoration: 'none' }}>
              <div 
                style={{ 
                  marginBottom: '16px',
                  padding: '12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                    {account.name}
                  </span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  GM {(account.gm7d * 100).toFixed(0)}%
                </span>
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: '16px', 
                fontSize: '12px' 
              }}>
                <div>
                  <p style={{ color: '#6b7280', margin: '0' }}>Revenue</p>
                  <p style={{ fontWeight: '600', margin: '2px 0 0 0' }}>
                    ${(account.revenue7d / 1000).toFixed(0)}k
                  </p>
                </div>
                <div>
                  <p style={{ color: '#6b7280', margin: '0' }}>Cost</p>
                  <p style={{ fontWeight: '600', margin: '2px 0 0 0' }}>
                    ${(account.cost7d / 1000).toFixed(0)}k
                  </p>
                </div>
                <div>
                  <p style={{ color: '#6b7280', margin: '0' }}>GM</p>
                  <p style={{ fontWeight: '600', margin: '2px 0 0 0' }}>
                    {(account.gm7d * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
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
          Paid Accounts <span style={{ 
            fontSize: '14px', 
            fontWeight: '400', 
            color: '#6b7280' 
          }}>(rev/cost/SLAs)</span>
        </h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{
                padding: '12px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Account</th>
              <th style={{
                padding: '12px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Workflow</th>
              <th style={{
                padding: '12px 24px',
                textAlign: 'right',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Revenue 7d</th>
              <th style={{
                padding: '12px 24px',
                textAlign: 'right',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Cost 7d</th>
              <th style={{
                padding: '12px 24px',
                textAlign: 'right',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>GM%</th>
              <th style={{
                padding: '12px 24px',
                textAlign: 'right',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Volume</th>
              <th style={{
                padding: '12px 24px',
                textAlign: 'right',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>QC%</th>
              <th style={{
                padding: '12px 24px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Trend</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: 'white' }}>
            {paidAccounts.map((account, index) => (
              <Link key={account.id} href={`/accounts/${account.id}`} style={{ textDecoration: 'none' }}>
                <tr 
                  style={{
                    borderBottom: index < paidAccounts.length - 1 ? '1px solid #f3f4f6' : 'none',
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
                    padding: '16px 24px',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    {account.name}
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    STO
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    color: '#111827',
                    textAlign: 'right'
                  }}>
                    ${(account.revenue7d / 1000).toFixed(0)}k
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    color: '#111827',
                    textAlign: 'right'
                  }}>
                    ${(account.cost7d / 1000).toFixed(0)}k
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    color: '#111827',
                    textAlign: 'right'
                  }}>
                    {(account.gm7d * 100).toFixed(1)}%
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    color: '#111827',
                    textAlign: 'right'
                  }}>
                    {account.volume7d.toLocaleString()}
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    color: '#111827',
                    textAlign: 'right'
                  }}>
                    {(account.qcPct7d * 100).toFixed(0)}%
                  </td>
                  <td style={{
                    padding: '16px 24px',
                    whiteSpace: 'nowrap',
                    width: '80px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '32px',
                      backgroundColor: '#dbeafe',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <span style={{ fontSize: '12px', color: '#2563eb' }}>Chart</span>
                    </div>
                  </td>
                </tr>
              </Link>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
