import { prisma } from "@/lib/prisma"
import { ActionsBoard } from "@/components/actions/actions-board"
import { ActionsFilters } from "@/components/actions/actions-filters"
import { Suspense } from "react"

interface PageProps {
  searchParams: Promise<{
    severity?: string
    responsible?: string
    account?: string
  }>
}

export default async function ActionsPage({ searchParams }: PageProps) {
  const params = await searchParams
  
  const filters = {
    status: { not: 'closed' },
    ...(params.severity && { severity: params.severity }),
    ...(params.responsible && { 
      responsible: { contains: params.responsible, mode: 'insensitive' as const } 
    }),
    ...(params.account && { accountId: params.account }),
  }
  
  const [actions, accounts] = await Promise.all([
    prisma.action.findMany({
      where: filters,
      include: {
        account: true,
        workflow: true,
      },
      orderBy: [
        { severity: 'asc' },
        { ageD: 'desc' },
      ],
    }),
    prisma.account.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])
  
  // Get unique responsible people
  const allActions = await prisma.action.findMany({
    select: { responsible: true },
    distinct: ['responsible'],
  })
  const responsibles = allActions.map(a => a.responsible).filter(Boolean)
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Actions</h1>
        <p className="text-muted-foreground">
          Track and manage all open actions and blockers
        </p>
      </div>

      <Suspense fallback={<div className="h-16 bg-muted rounded-lg animate-pulse" />}>
        <ActionsFilters 
          accounts={accounts} 
          responsibles={responsibles} 
        />
      </Suspense>
      
      <ActionsBoard actions={actions} />
    </div>
  )
}