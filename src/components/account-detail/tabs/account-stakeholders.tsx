import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusChip } from "@/components/ui/status-chip"

interface AccountStakeholdersProps {
  stakeholders: Array<{
    id: string
    name: string
    role: string
    contact: string | null
    sentiments: Array<{
      sentiment: string
      date: Date
    }>
  }>
}

export function AccountStakeholders({ stakeholders }: AccountStakeholdersProps) {
  if (stakeholders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Stakeholders</CardTitle>
          <CardDescription>
            No stakeholders have been identified for this account yet.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'sponsor': return 'default'
      case 'champion': return 'secondary' 
      case 'security': return 'outline'
      case 'ops': return 'outline'
      case 'it': return 'outline'
      case 'procurement': return 'outline'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-4">
      {stakeholders.map((stakeholder) => (
        <Card key={stakeholder.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {stakeholder.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{stakeholder.name}</CardTitle>
                  <CardDescription>{stakeholder.contact}</CardDescription>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {stakeholder.sentiments[0] && (
                  <StatusChip sentiment={stakeholder.sentiments[0].sentiment} size="sm" />
                )}
                <Badge variant={getRoleBadgeVariant(stakeholder.role)}>
                  {stakeholder.role.charAt(0).toUpperCase() + stakeholder.role.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
