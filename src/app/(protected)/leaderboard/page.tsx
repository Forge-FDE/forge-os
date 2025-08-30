import { prisma } from "@/lib/prisma"
import { LeaderboardCards } from "@/components/leaderboard/leaderboard-cards"
import { startOfWeek, endOfWeek } from "date-fns"

export default async function LeaderboardPage() {
  const weekStart = startOfWeek(new Date())
  const weekEnd = endOfWeek(new Date())
  
  // Fetch leaderboard metrics
  const stos = await prisma.user.findMany({
    where: {
      accounts: { some: {} },
    },
    include: {
      accounts: {
        include: {
          actions: {
            where: {
              status: 'closed',
              lastUpdate: {
                gte: weekStart,
                lte: weekEnd,
              },
            },
          },
        },
      },
    },
  })
  
  // Calculate metrics
  const leaderboardData = stos.map(sto => {
    const closedCount = sto.accounts.reduce((sum, acc) => sum + acc.actions.length, 0)
    const avgDslt = sto.accounts.reduce((sum, acc) => sum + acc.dsltDays, 0) / Math.max(sto.accounts.length, 1)
    const greenAccounts = sto.accounts.filter(acc => acc.sentiment === 'G').length
    const escalations = sto.accounts.filter(acc => acc.escalationState === 'escalate').length
    
    return {
      id: sto.id,
      name: sto.name || sto.email.split('@')[0],
      email: sto.email,
      metrics: {
        closedActions: closedCount,
        avgDslt: avgDslt,
        greenAccounts: greenAccounts,
        totalAccounts: sto.accounts.length,
        escalations: escalations,
        score: closedCount * 10 + greenAccounts * 5 - escalations * 20 - Math.max(avgDslt - 2, 0) * 15,
      },
    }
  }).sort((a, b) => b.metrics.score - a.metrics.score)
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ 
          fontSize: '30px', 
          fontWeight: 'bold', 
          letterSpacing: '-0.025em', 
          margin: '0 0 8px 0',
          color: '#111827'
        }}>
          Leaderboard
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280', 
          margin: '0' 
        }}>
          Weekly performance metrics and team rankings
        </p>
      </div>

      <LeaderboardCards data={leaderboardData} />
    </div>
  )
}