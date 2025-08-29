import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">
          Team performance metrics and rankings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Rankings</CardTitle>
          <CardDescription>
            Top performers this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No data available. Rankings will appear after data ingestion.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
