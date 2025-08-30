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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ 
          fontSize: '30px', 
          fontWeight: 'bold', 
          letterSpacing: '-0.025em', 
          margin: '0 0 8px 0',
          color: '#111827'
        }}>
          Actions
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280', 
          margin: '0' 
        }}>
          Track and manage all open actions and blockers
        </p>
      </div>

      <Suspense fallback={
        <div style={{ 
          height: '64px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '8px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }} />
      }>
        <ActionsFilters 
          accounts={accounts} 
          responsibles={responsibles} 
        />
      </Suspense>
      
      <ActionsBoard actions={actions} />
    </div>
  )
}