import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Mail, Phone, Users, Building } from "lucide-react"

interface HistoryProps {
  touches: Array<{
    id: string
    touchedAt: Date
    actor: string
    channel: string
    summary: string | null
  }>
}

export function AccountHistory({ touches }: HistoryProps) {
  const channelIcons = {
    exec: Building,
    team: Users,
    email: Mail,
    call: Phone,
  }
  
  const channelLabels = {
    exec: "Executive",
    team: "Team",
    email: "Email",
    call: "Call",
  }
  
  if (touches.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          No touch history recorded
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-4">
      {touches.map((touch) => {
        const Icon = channelIcons[touch.channel as keyof typeof channelIcons] || Mail
        const label = channelLabels[touch.channel as keyof typeof channelLabels] || touch.channel
        
        return (
          <Card key={touch.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{touch.actor}</span>
                    <Badge variant="outline" className="text-xs">
                      {label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(touch.touchedAt), { addSuffix: true })}
                    </span>
                  </div>
                  {touch.summary && (
                    <p className="text-sm text-muted-foreground">{touch.summary}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}