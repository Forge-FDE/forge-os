import { prisma } from "@/lib/prisma"
import { MetricCard } from "@/components/dashboard/metric-card"
import { EscalationQueueV2 } from "@/components/dashboard/escalation-queue-v2"
import { OwnerLoadV2 } from "@/components/dashboard/owner-load-v2"
import { PaidAccountsV2 } from "@/components/dashboard/paid-accounts-v2"

export default async function DashboardPage() {
  // Fetch dashboard data
  const [accounts, workflows, owners, , metrics] = await Promise.all([
    prisma.account.findMany({
      include: {
        sto: true,
        actions: {
          where: { status: { not: 'closed' } },
          select: { severity: true },
        },
      },
    }),
    // Fetch escalated workflows (from accounts with escalationState != 'none')
    prisma.workflow.findMany({
      where: {
        account: {
          escalationState: { not: 'none' }
        }
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            escalationState: true,
            escalationScore: true,
            oldestBlockerAgeD: true,
            nextGateDue: true,
            sentiment: true
          }
        },
        ownerFde: {
          select: {
            id: true,
            name: true
          }
        },
        actions: {
          where: { status: { not: 'closed' } },
          select: { 
            id: true,
            severity: true,
            dueDate: true,
            title: true
          }
        }
      },
      orderBy: [
        { account: { escalationScore: 'desc' } },
        { dueDate: 'asc' }
      ]
    }),
    prisma.user.findMany({
      where: { accounts: { some: {} } },
      include: {
        _count: {
          select: { accounts: true },
        },
      },
    }),
    prisma.action.count({
      where: { status: { not: 'closed' } },
    }),
    prisma.account.aggregate({
      _sum: {
        revenue7d: true,
        cost7d: true,
        volume7d: true,
      },
      _avg: {
        qcPct7d: true,
        aht7d: true,
      },
    }),
  ])
  
  const escalatedCount = accounts.filter(a => a.escalationState !== 'none').length
  const totalRevenue = metrics._sum.revenue7d || 0
  const avgQC = metrics._avg.qcPct7d || 0
  const avgAHT = metrics._avg.aht7d || 0
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Metrics Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(5, 1fr)', 
        gap: '16px' 
      }}>
        <MetricCard
          title="Active Accounts"
          value={accounts.length}
        />
        <MetricCard
          title="Escalations"
          value={escalatedCount}
        />
        <MetricCard
          title="Revenue 7d"
          value={`$${(totalRevenue / 1000).toFixed(0)}k`}
        />
        <MetricCard
          title="Avg QC"
          value={`${(avgQC * 100).toFixed(0)}%`}
        />
        <MetricCard
          title="Avg AHT"
          value={`${avgAHT.toFixed(1)}d`}
        />
      </div>

      {/* Main Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '24px' 
      }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <EscalationQueueV2 workflows={workflows} />
          <PaidAccountsV2 accounts={accounts} title="All Accounts" />
        </div>
        
        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <OwnerLoadV2 data={owners} />
          <PaidAccountsV2 
            accounts={accounts.filter(a => a.revenue7d > 0)} 
            compact={true}
          />
        </div>
      </div>
    </div>
  )
}
