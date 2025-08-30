import { prisma } from "@/lib/prisma"
import { MetricCard } from "@/components/dashboard/metric-card"
import { EscalationQueueV2 } from "@/components/dashboard/escalation-queue-v2"
import { OwnerLoadV2 } from "@/components/dashboard/owner-load-v2"
import { PaidAccountsV2 } from "@/components/dashboard/paid-accounts-v2"

export default async function DashboardPage() {
  // Fetch dashboard data
  const [accounts, owners, , metrics] = await Promise.all([
    prisma.account.findMany({
      include: {
        sto: true,
        actions: {
          where: { status: { not: 'closed' } },
          select: { severity: true },
        },
      },
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
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-5 gap-4">
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
      <div className="grid grid-cols-12 gap-6">
        {/* Escalation Queue - Left Column */}
        <div className="col-span-8 space-y-6">
          <EscalationQueueV2 accounts={accounts} />
          <PaidAccountsV2 accounts={accounts} />
        </div>
        
        {/* Right Column */}
        <div className="col-span-4 space-y-6">
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
