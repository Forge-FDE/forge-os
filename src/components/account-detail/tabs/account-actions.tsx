import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface AccountActionsProps {
  actions: Array<{
    id: string
    title: string
    severity: string
    status: string
    responsible: string
    dueDate: Date | null
    openedAt: Date
    ageD: number
  }>
}

export function AccountActions({ actions }: AccountActionsProps) {
  const openActions = actions.filter(a => a.status !== 'closed')
  
  if (openActions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Open Actions</CardTitle>
          <CardDescription>
            All actions for this account have been resolved.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'sev-0': return 'destructive'
      case 'sev-1': return 'default'
      case 'sev-2': return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'open': return 'default'
      case 'at_risk': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-4">
      {openActions.map((action) => (
        <Card key={action.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{action.title}</CardTitle>
                <CardDescription>
                  Responsible: {action.responsible} • Opened {formatDistanceToNow(new Date(action.openedAt), { addSuffix: true })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant={getSeverityVariant(action.severity)}>
                  {action.severity.toUpperCase()}
                </Badge>
                <Badge variant={getStatusVariant(action.status)}>
                  {action.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Age: {action.ageD} days</span>
              {action.dueDate && (
                <span>
                  Due: {formatDistanceToNow(new Date(action.dueDate), { addSuffix: true })}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
