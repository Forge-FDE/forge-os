import { prisma } from "@/lib/prisma"
import { WorkflowsTable } from "@/components/workflows/workflows-table"

export default async function WorkflowsPage() {
  const workflows = await prisma.workflow.findMany({
    include: {
      account: true,
      ownerFde: true,
      actions: {
        where: { status: { not: 'closed' } },
      },
    },
    orderBy: [
      { volume7d: 'desc' },
    ],
  })
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
        <p className="text-muted-foreground">
          Track workflow progress and ownership across all accounts
        </p>
      </div>

      <WorkflowsTable workflows={workflows} />
    </div>
  )
}