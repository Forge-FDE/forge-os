import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
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
    P0_ALIGN: "bg-gray-100 text-gray-700",
    P1_PILOT: "bg-blue-100 text-blue-700",
    P2_EXPANSION: "bg-purple-100 text-purple-700",
    P3_ENTERPRISE: "bg-green-100 text-green-700",
    P4_HANDOFF: "bg-orange-100 text-orange-700",
  }
  
  const sentimentColors = {
    R: "bg-red-500",
    Y: "bg-yellow-500",
    G: "bg-green-500",
  }
  
  return (
    <Card className="bg-white shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Escalation Queue</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phase</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STD</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DSLT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oldest blocker age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next gate due</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {escalated.map((account) => {
              const phaseNum = account.phase.split('_')[0].replace('P', '')
              return (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {account.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={cn("text-xs", phaseColors[account.phase as keyof typeof phaseColors])}>
                      {phaseNum}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.sto.name?.split(' ')[0] || account.sto.email.split('@')[0].toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {account.dsltDays}d
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`w-4 h-4 rounded-full ${sentimentColors[account.sentiment as keyof typeof sentimentColors]}`} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {account.oldestBlockerAgeD}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.nextGateDue ? `P${phaseNum}-1` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.escalationScore}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
