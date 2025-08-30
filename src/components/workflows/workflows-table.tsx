import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusChip } from "@/components/ui/status-chip"
import { PhaseIndicator } from "@/components/ui/phase-indicator"
import { CheckCircle, ExternalLink } from "lucide-react"
import { Phase } from "@prisma/client"

interface WorkflowsTableProps {
  workflows: Array<{
    id: string
    name: string
    phase: Phase
    account: {
      id: string
      name: string
    }
    ownerFde: {
      name: string | null
      email: string
    } | null
    golden10: boolean
    accessReady: boolean
    volume7d: number
    qcPct7d: number
    aht7d: number
    automation7d: number
    budgetUtil7d: number
    nextMilestone: string | null
    wgSentiment: string | null
    actions: Array<{
      id: string
      status: string
    }>
  }>
}

export function WorkflowsTable({ workflows }: WorkflowsTableProps) {
  if (workflows.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          No workflows found. Workflows will appear after data ingestion.
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workflow</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right">QC%</TableHead>
              <TableHead className="text-right">Auto%</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map((workflow) => (
              <TableRow key={workflow.id}>
                <TableCell className="font-medium">{workflow.name}</TableCell>
                <TableCell>{workflow.account.name}</TableCell>
                <TableCell>
                  <PhaseIndicator phase={workflow.phase} showLabel={false} />
                </TableCell>
                <TableCell>
                  {workflow.ownerFde 
                    ? workflow.ownerFde.name || workflow.ownerFde.email.split('@')[0]
                    : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {workflow.golden10 && (
                      <Badge variant="outline" className="gap-1 text-xs">
                        <CheckCircle className="h-2 w-2" />
                        G10
                      </Badge>
                    )}
                    {workflow.accessReady && (
                      <Badge variant="outline" className="gap-1 text-xs">
                        <CheckCircle className="h-2 w-2" />
                        Ready
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {workflow.volume7d.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <span className={workflow.qcPct7d >= 0.99 ? "text-green-600" : "text-amber-600"}>
                    {(workflow.qcPct7d * 100).toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {(workflow.automation7d * 100).toFixed(0)}%
                </TableCell>
                <TableCell className="text-right">
                  <span className={workflow.budgetUtil7d > 0.9 ? "text-red-600" : ""}>
                    {(workflow.budgetUtil7d * 100).toFixed(0)}%
                  </span>
                </TableCell>
                <TableCell>
                  <StatusChip sentiment={workflow.wgSentiment} size="sm" />
                </TableCell>
                <TableCell>
                  {workflow.actions.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {workflow.actions.length}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/accounts/${workflow.account.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
