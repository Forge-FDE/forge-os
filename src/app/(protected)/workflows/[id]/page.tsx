import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { WorkflowHeader } from "@/components/workflow/workflow-header"
import { WorkflowGantt } from "@/components/workflow/workflow-gantt"
import { WorkflowStats } from "@/components/workflow/workflow-stats"
import { StakeholderTracking } from "@/components/workflow/stakeholder-tracking"

interface WorkflowPageProps {
  params: Promise<{ id: string }>
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { id } = await params

  const workflow = await prisma.workflow.findUnique({
    where: { id },
    include: {
      account: {
        include: {
          sto: true,
          sponsor: true,
          champion: true,
        }
      },
      ownerFde: true,
      actions: {
        include: {
          assignedTo: true,
        },
        orderBy: {
          dueDate: 'asc'
        }
      },
      communications: {
        include: {
          fromUser: true,
          toUser: true,
        },
        orderBy: {
          timestamp: 'desc'
        }
      }
    }
  })

  if (!workflow) {
    notFound()
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px',
      padding: '24px',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    }}>
      <WorkflowHeader workflow={workflow} />
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '24px',
        height: '500px'
      }}>
        <WorkflowGantt actions={workflow.actions} />
        <WorkflowStats workflow={workflow} />
      </div>

      <StakeholderTracking 
        workflow={workflow} 
        communications={workflow.communications}
      />
    </div>
  )
}
