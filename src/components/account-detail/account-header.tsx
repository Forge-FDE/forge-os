import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StatusChip } from "@/components/ui/status-chip"
import { EscalationBadge } from "@/components/ui/escalation-badge"
import { PhaseIndicator } from "@/components/ui/phase-indicator"
import { formatDistanceToNow } from "date-fns"
import { Building2, Calendar, User } from "lucide-react"
import { Phase } from "@prisma/client"

interface AccountHeaderProps {
  account: {
    name: string
    codename: string | null
    phase: Phase
    sto: {
      id: string
      name: string | null
      email: string
      role: string
      createdAt: Date
    } | null
    sponsor: string | null
    champion: string | null
    sentiment: string | null
    dsltDays: number
    nextGateDue: Date | null
    escalationState: string
    escalationScore: number
  }
}

export function AccountHeader({ account }: AccountHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Building2 className="h-8 w-8 text-muted-foreground" />
            {account.name}
          </h1>
          {account.codename && (
            <p className="text-muted-foreground">Codename: {account.codename}</p>
          )}
        </div>
        <EscalationBadge 
          state={account.escalationState} 
          score={account.escalationScore}
        />
      </div>
      
      <div className="flex flex-wrap gap-4">
        {account.sto && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {account.sto.name?.[0] || account.sto.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">STO</p>
              <p className="text-sm text-muted-foreground">
                {account.sto.name || account.sto.email}
              </p>
            </div>
          </div>
        )}
        
        {account.sponsor && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Sponsor</p>
              <p className="text-sm text-muted-foreground">{account.sponsor}</p>
            </div>
          </div>
        )}
        
        {account.champion && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Champion</p>
              <p className="text-sm text-muted-foreground">{account.champion}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Next Gate</p>
            <p className="text-sm text-muted-foreground">
              {account.nextGateDue
                ? formatDistanceToNow(new Date(account.nextGateDue), { addSuffix: true })
                : 'Not set'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <PhaseIndicator phase={account.phase} />
        <StatusChip sentiment={account.sentiment} />
        <Badge variant={account.dsltDays > 2 ? "destructive" : "default"}>
          DSLT: {account.dsltDays} days
        </Badge>
      </div>
    </div>
  )
}
