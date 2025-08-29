import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { AccountsTable } from "@/components/accounts/accounts-table"
import { AccountsFilters } from "@/components/accounts/accounts-filters"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  searchParams: {
    phase?: string
    sentiment?: string
    sto?: string
    state?: string
    search?: string
  }
}

export default async function AccountsPage({ searchParams }: PageProps) {
  const filters = {
    ...(searchParams.phase && { phase: searchParams.phase }),
    ...(searchParams.sentiment && { sentiment: searchParams.sentiment }),
    ...(searchParams.sto && { stoId: searchParams.sto }),
    ...(searchParams.state && { escalationState: searchParams.state }),
    ...(searchParams.search && {
      OR: [
        { name: { contains: searchParams.search, mode: 'insensitive' as const } },
        { codename: { contains: searchParams.search, mode: 'insensitive' as const } },
      ],
    }),
  }
  
  const [accounts, stos] = await Promise.all([
    prisma.account.findMany({
      where: filters,
      include: {
        sto: true,
        workflows: true,
        actions: {
          where: { status: { not: 'closed' } },
        },
      },
      orderBy: { escalationScore: 'desc' },
    }),
    prisma.user.findMany({
      where: { accounts: { some: {} } },
      orderBy: { name: 'asc' },
    }),
  ])
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
        <p className="text-muted-foreground">
          Manage and monitor all customer accounts
        </p>
      </div>

      <AccountsFilters stos={stos} />
      
      <Suspense fallback={<AccountsTableSkeleton />}>
        <AccountsTable accounts={accounts} />
      </Suspense>
    </div>
  )
}

function AccountsTableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="space-y-3 p-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
