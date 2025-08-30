"use client"

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
            <div key={account.id} style={{ marginBottom: '16px' }}>
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
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue 7d</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost 7d</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">GM%</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">QC%</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paidAccounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {account.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  STO
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  ${(account.revenue7d / 1000).toFixed(0)}k
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  ${(account.cost7d / 1000).toFixed(0)}k
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {(account.gm7d * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {account.volume7d.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {(account.qcPct7d * 100).toFixed(0)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap w-20">
                  <div className="w-16 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-xs text-blue-600">Chart</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
