import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { KPICard } from "@/components/ui/kpi-card"
import { EscalationQueue } from "@/components/dashboard/escalation-queue"
import { OwnerLoad } from "@/components/dashboard/owner-load"
import { PaidAccounts } from "@/components/dashboard/paid-accounts"

export default async function DashboardPage() {
  const session = await auth()
  
  // Fetch dashboard data
  const [accounts, owners, openActions, metrics] = await Promise.all([
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
        automation7d: true,
      },
    }),
  ])
  
  const escalatedCount = accounts.filter(a => a.escalationState !== 'none').length
  const totalRevenue = metrics._sum.revenue7d || 0
  const totalCost = metrics._sum.cost7d || 0
  const totalGM = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Accounts"
          value={accounts.length}
          description="Active accounts"
        />
        <KPICard
          title="Open Actions"
          value={openActions}
          description="Requiring attention"
          deltaType={openActions > 10 ? "negative" : "neutral"}
        />
        <KPICard
          title="Escalations"
          value={escalatedCount}
          description="At risk accounts"
          deltaType={escalatedCount > 0 ? "negative" : "positive"}
        />
        <KPICard
          title="Weekly Revenue"
          value={`$${(totalRevenue / 1000).toFixed(1)}k`}
          description="Last 7 days"
        />
        <KPICard
          title="Gross Margin"
          value={`${totalGM.toFixed(1)}%`}
          description="Last 7 days"
          deltaType={totalGM > 30 ? "positive" : "negative"}
        />
      </div>

      <EscalationQueue accounts={accounts} />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <OwnerLoad data={owners} />
        <PaidAccounts accounts={accounts} />
      </div>
    </div>
  )
}
