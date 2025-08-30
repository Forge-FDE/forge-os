import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Phone, Mail, Users } from "lucide-react"

interface AccountHistoryProps {
  touches: Array<{
    id: string
    accountId: string
    workflowId: string | null
    touchedAt: Date
    actor: string
    channel: string
    summary: string | null
  }>
}

export function AccountHistory({ touches }: AccountHistoryProps) {
  if (touches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Touch History</CardTitle>
          <CardDescription>
            No interaction history has been recorded for this account yet.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return Mail
      case 'call': return Phone
      case 'team': return Users
      case 'exec': return Users
      default: return MessageSquare
    }
  }

  const getChannelVariant = (channel: string) => {
    switch (channel) {
      case 'exec': return 'default'
      case 'team': return 'secondary'
      case 'email': return 'outline'
      case 'call': return 'outline'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-4">
      {touches.map((touch) => {
        const Icon = getChannelIcon(touch.channel)
        
        return (
          <Card key={touch.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-base">{touch.actor}</CardTitle>
                    <CardDescription>
                      {formatDistanceToNow(new Date(touch.touchedAt), { addSuffix: true })}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={getChannelVariant(touch.channel)}>
                  {touch.channel.charAt(0).toUpperCase() + touch.channel.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            {touch.summary && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{touch.summary}</p>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
