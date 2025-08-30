"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Clock, AlertTriangle, FileText, Slack, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActionsProps {
  actions: Array<{
    id: string
    title: string
    severity: string
    status: string
    responsible: string
    dueDate: Date | null
    openedAt: Date
    lastUpdate: Date
    slackLink: string | null
    docLink: string | null
    ageD: number
  }>
  accountId: string
}

export function AccountActions({ actions, accountId }: ActionsProps) {
  const { toast } = useToast()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState<Record<string, string>>({})
  
  const openActions = actions.filter(a => a.status === 'open')
  const atRiskActions = actions.filter(a => a.status === 'at_risk')
  const closedActions = actions.filter(a => a.status === 'closed')
  
  const handleStatusChange = async (actionId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/accounts/${accountId}/actions/${actionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (response.ok) {
        toast({
          title: "Status updated",
          description: "Action status has been updated successfully",
        })
        setEditingId(null)
        // In production, you'd refresh the data here
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update action status",
        variant: "destructive",
      })
    }
  }
  
  const ActionCard = ({ action }: { action: typeof actions[0] }) => {
    const severityColors = {
      'sev-0': 'bg-red-100 text-red-800 border-red-300',
      'sev-1': 'bg-orange-100 text-orange-800 border-orange-300',
      'sev-2': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    }
    
    const isOverdue = action.dueDate && new Date(action.dueDate) < new Date()
    const isAging = action.ageD > (action.severity === 'sev-1' ? 2 : 5)
    
    return (
      <Card className={`${severityColors[action.severity as keyof typeof severityColors]} border-2`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium line-clamp-2">
              {action.title}
            </CardTitle>
            <Badge variant="outline" className="ml-2 shrink-0">
              {action.severity}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">{action.responsible}</span>
            <div className="flex items-center gap-1">
              <Clock className={`h-3 w-3 ${isAging ? 'text-red-600' : ''}`} />
              <span className={isAging ? 'text-red-600 font-medium' : ''}>
                {action.ageD}d old
              </span>
            </div>
          </div>
          
          {action.dueDate && (
            <div className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-600' : ''}`}>
              <Calendar className="h-3 w-3" />
              Due {formatDistanceToNow(new Date(action.dueDate), { addSuffix: true })}
            </div>
          )}
          
          <div className="flex gap-2">
            {action.slackLink && (
              <a href={action.slackLink} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" className="h-7 px-2">
                  <Slack className="h-3 w-3" />
                </Button>
              </a>
            )}
            {action.docLink && (
              <a href={action.docLink} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" className="h-7 px-2">
                  <FileText className="h-3 w-3" />
                </Button>
              </a>
            )}
          </div>
          
          {editingId === action.id ? (
            <Select
              value={editStatus[action.id] || action.status}
              onValueChange={(value) => {
                setEditStatus({ ...editStatus, [action.id]: value })
                handleStatusChange(action.id, value)
              }}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="at_risk">At Risk</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="w-full h-7 text-xs"
              onClick={() => setEditingId(action.id)}
            >
              Change Status
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Open ({openActions.length})</h3>
          {openActions.some(a => a.severity === 'sev-0' || a.severity === 'sev-1') && (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
        </div>
        <div className="space-y-3">
          {openActions.map(action => (
            <ActionCard key={action.id} action={action} />
          ))}
          {openActions.length === 0 && (
            <Card>
              <CardContent className="p-4 text-center text-sm text-muted-foreground">
                No open actions
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="font-semibold">At Risk ({atRiskActions.length})</h3>
        <div className="space-y-3">
          {atRiskActions.map(action => (
            <ActionCard key={action.id} action={action} />
          ))}
          {atRiskActions.length === 0 && (
            <Card>
              <CardContent className="p-4 text-center text-sm text-muted-foreground">
                No at-risk actions
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="font-semibold">Closed ({closedActions.length})</h3>
        <div className="space-y-3">
          {closedActions.slice(0, 5).map(action => (
            <ActionCard key={action.id} action={action} />
          ))}
          {closedActions.length === 0 && (
            <Card>
              <CardContent className="p-4 text-center text-sm text-muted-foreground">
                No closed actions
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}