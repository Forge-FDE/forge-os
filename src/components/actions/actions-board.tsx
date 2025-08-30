"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, FileText, Slack, Building2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Action {
  id: string
  title: string
  severity: string
  status: string
  responsible: string
  dueDate: Date | null
  openedAt: Date
  ageD: number
  slackLink: string | null
  docLink: string | null
  account: {
    id: string
    name: string
  }
  workflow: {
    name: string
  } | null
}

interface ActionsBoardProps {
  actions: Action[]
}

export function ActionsBoard({ actions }: ActionsBoardProps) {
  const openActions = actions.filter(a => a.status === 'open')
  const atRiskActions = actions.filter(a => a.status === 'at_risk')
  
  const ActionCard = ({ action }: { action: Action }) => {
    const severityConfig = {
      'sev-0': { color: 'destructive', label: 'SEV-0' },
      'sev-1': { color: 'destructive', label: 'SEV-1' },
      'sev-2': { color: 'secondary', label: 'SEV-2' },
    }
    
    const config = severityConfig[action.severity as keyof typeof severityConfig] || severityConfig['sev-2']
    const isOverdue = action.dueDate && new Date(action.dueDate) < new Date()
    const isAging = action.ageD > (action.severity === 'sev-1' ? 2 : 5)
    
    return (
      <Card className={isAging ? "border-red-500" : ""}>
        <CardHeader className="pb-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant={config.color === 'destructive' ? 'destructive' : 'secondary'}>
                {config.label}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className={`h-3 w-3 ${isAging ? 'text-red-600' : ''}`} />
                <span className={isAging ? 'text-red-600 font-medium' : ''}>
                  {action.ageD}d
                </span>
              </div>
            </div>
            <CardTitle className="text-sm font-medium line-clamp-2">
              {action.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs">
              <Building2 className="h-3 w-3" />
              <span className="font-medium">{action.account.name}</span>
            </div>
            {action.workflow && (
              <p className="text-xs text-muted-foreground ml-4">
                {action.workflow.name}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{action.responsible}</span>
            {action.dueDate && (
              <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                Due {formatDistanceToNow(new Date(action.dueDate), { addSuffix: true })}
              </span>
            )}
          </div>
          
          <div className="flex gap-1">
            {action.slackLink && (
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" asChild>
                <a href={action.slackLink} target="_blank" rel="noopener noreferrer">
                  <Slack className="h-3 w-3" />
                </a>
              </Button>
            )}
            {action.docLink && (
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" asChild>
                <a href={action.docLink} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Open ({openActions.length})</h2>
          {openActions.some(a => a.severity === 'sev-0' || a.severity === 'sev-1') && (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          )}
        </div>
        <div className="space-y-3">
          {openActions.map(action => (
            <ActionCard key={action.id} action={action} />
          ))}
          {openActions.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                No open actions
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">At Risk ({atRiskActions.length})</h2>
        <div className="space-y-3">
          {atRiskActions.map(action => (
            <ActionCard key={action.id} action={action} />
          ))}
          {atRiskActions.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                No at-risk actions
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
