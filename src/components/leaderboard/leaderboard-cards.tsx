import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, Shield, Clock, Target } from "lucide-react"

interface LeaderboardData {
  id: string
  name: string
  email: string
  metrics: {
    closedActions: number
    avgDslt: number
    greenAccounts: number
    totalAccounts: number
    escalations: number
    score: number
  }
}

interface LeaderboardCardsProps {
  data: LeaderboardData[]
}

export function LeaderboardCards({ data }: LeaderboardCardsProps) {
  const top3 = data.slice(0, 3)
  const medals = ["🥇", "🥈", "🥉"]
  
  return (
    <div className="space-y-6">
      {/* Top Performers */}
      <div className="grid gap-4 md:grid-cols-3">
        {top3.map((person, index) => (
          <Card key={person.id} className={index === 0 ? "border-yellow-500 border-2" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{medals[index]}</span>
                  <Avatar>
                    <AvatarFallback>{person.name[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <Badge variant="outline" className="text-lg font-bold">
                  {person.metrics.score} pts
                </Badge>
              </div>
              <CardTitle>{person.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actions Closed</span>
                  <span className="font-medium">{person.metrics.closedActions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg DSLT</span>
                  <span className="font-medium">{person.metrics.avgDslt.toFixed(1)}d</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Green Accounts</span>
                  <span className="font-medium">{person.metrics.greenAccounts}/{person.metrics.totalAccounts}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Winners */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              <CardTitle className="text-base">Action Hero</CardTitle>
            </div>
            <CardDescription>Most actions closed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data[0]?.name || "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {data[0]?.metrics.closedActions || 0} actions closed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-base">DSLT Champion</CardTitle>
            </div>
            <CardDescription>Best DSLT average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.sort((a, b) => a.metrics.avgDslt - b.metrics.avgDslt)[0]?.name || "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {data[0]?.metrics.avgDslt.toFixed(1) || 0}d average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <CardTitle className="text-base">Sentiment Star</CardTitle>
            </div>
            <CardDescription>Most green accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.sort((a, b) => b.metrics.greenAccounts - a.metrics.greenAccounts)[0]?.name || "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {data[0]?.metrics.greenAccounts || 0} green accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-base">Risk Manager</CardTitle>
            </div>
            <CardDescription>Fewest escalations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.sort((a, b) => a.metrics.escalations - b.metrics.escalations)[0]?.name || "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {data[0]?.metrics.escalations || 0} escalations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Full Rankings */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Rankings</CardTitle>
          <CardDescription>Complete leaderboard for this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.map((person, index) => (
              <div key={person.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground w-8">
                    #{index + 1}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{person.name[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{person.metrics.score} pts</p>
                    <p className="text-xs text-muted-foreground">
                      {person.metrics.totalAccounts} accounts
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
