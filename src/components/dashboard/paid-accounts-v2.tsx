"use client"

import { Card } from "@/components/ui/card"
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
      <Card className="bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Paid Accounts <span className="text-sm font-normal text-gray-500">(rev/cost/SLAs)</span>
          </h3>
        </div>
        <div className="p-6 space-y-4">
          {paidAccounts.map((account) => (
            <div key={account.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{account.name}</span>
                <span className="text-sm text-gray-500">GM {(account.gm7d * 100).toFixed(0)}%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-gray-500">Revenue</p>
                  <p className="font-semibold">${(account.revenue7d / 1000).toFixed(0)}k</p>
                </div>
                <div>
                  <p className="text-gray-500">Cost</p>
                  <p className="font-semibold">${(account.cost7d / 1000).toFixed(0)}k</p>
                </div>
                <div>
                  <p className="text-gray-500">GM</p>
                  <p className="font-semibold">{(account.gm7d * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }
  
  return (
    <Card className="bg-white shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Paid Accounts <span className="text-sm font-normal text-gray-500">(rev/cost/SLAs)</span>
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
    </Card>
  )
}
