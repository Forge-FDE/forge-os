import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PhaseIndicator } from "@/components/ui/phase-indicator"
import { Progress } from "@/components/ui/progress"
import { Phase } from "@prisma/client"

interface AccountWorkflowsProps {
  workflows: Array<{
    id: string
    name: string
    phase: Phase
    ownerFde: { name: string | null; email: string } | null
    golden10: boolean
    accessReady: boolean
    volume7d: number
    qcPct7d: number
    automation7d: number
    nextMilestone: string | null
    dueDate: Date | null
  }>
}

export function AccountWorkflows({ workflows }: AccountWorkflowsProps) {
  if (workflows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Workflows</CardTitle>
          <CardDescription>
            No workflows have been configured for this account yet.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {workflows.map((workflow) => (
        <Card key={workflow.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {workflow.name}
                  {workflow.golden10 && (
                    <Badge variant="secondary" className="text-xs">
                      Golden 10
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Owner: {workflow.ownerFde?.name || workflow.ownerFde?.email || 'Unassigned'}
                </CardDescription>
              </div>
              <PhaseIndicator phase={workflow.phase} showLabel={false} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Volume (7d)</span>
                  <span>{workflow.volume7d.toLocaleString()}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Quality</span>
                  <span>{(workflow.qcPct7d * 100).toFixed(1)}%</span>
                </div>
                <Progress value={workflow.qcPct7d * 100} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Automation</span>
                  <span>{(workflow.automation7d * 100).toFixed(0)}%</span>
                </div>
                <Progress value={workflow.automation7d * 100} />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Badge variant={workflow.accessReady ? "default" : "secondary"}>
                {workflow.accessReady ? "Access Ready" : "Access Pending"}
              </Badge>
              {workflow.nextMilestone && (
                <Badge variant="outline">
                  Next: {workflow.nextMilestone}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
